## Architecture Planning

**Entry 1: Project Genesis and Academic Motivation**

After thoroughly enjoying the foundational theory in my Operating Systems course and putting it into practice with a Custom Memory Allocator, I wanted a flagship project to apply the concepts from my Computer Communications and Networks (COMNS) and Computer Security courses. While I loved the COMNS course, the academic term was too short to dive as deeply into the raw implementation as I wanted. This Distributed P2P Node bridges that gap, putting TCP streams, sliding window protocols, asynchronous routing, and peer-to-peer security into raw C++ practice.

**Entry 2: The Delivery Service (TCP over UDP)**

When designing the transport layer, I had to choose between UDP and TCP. While UDP offers blistering speeds by firing packets blindly without waiting for acknowledgments, it is inherently lossy. For a P2P network distributing critical files or ledger data, a single dropped packet over UDP would permanently corrupt the entire payload. Therefore, I hardcoded the sockets to use `SOCK_STREAM`. TCP guarantees reliable, perfectly ordered delivery via network handshakes and automatic retransmissions, which is a strict requirement for this node's integrity.

**Entry 3: The Blocking Socket and Multithreading Trap**

My initial blueprint utilized standard POSIX blocking sockets. To prevent the node from freezing while waiting for TCP packets to arrive, I planned to spawn a dedicated `std::thread` for every incoming peer connection, using `std::mutex` to manage shared connection pools.

**Entry 4: The Workload Epiphany and Asynchronous Pivot**

During the early whiteboarding phase, a peer asked several probing questions about the workload and why multithreading was strictly necessary. This prompted a critical re-evaluation of the architecture. P2P networking is heavily I/O bound, meaning the system spends 99% of its time idling and waiting for packets. A thread-per-peer model is the wrong architectural choice for I/O bound workloads; spawning thousands of threads wastes RAM and creates massive OS context-switching overhead. I immediately discarded the multithreading plan and pivoted the networking layer to a Single-Threaded Asynchronous Event Loop using non-blocking sockets.

**Entry 5: CPU Starvation vs. Interrupts (Polling vs. Hardware Interrupts)**

After switching to non-blocking sockets, the application would no longer freeze when waiting for data, but it introduced a new problem: how to know when data finally arrives. The naive approach is "Polling"—writing an infinite `while(true)` loop that constantly checks the socket for data. However, polling would peg the CPU to 100% and drain resources while doing zero actual work. Instead of polling, the architecture relies on OS-level hardware interrupts. The single thread registers its sockets with the OS and goes to sleep (0% CPU usage). The exact nanosecond a packet hits the network card, the OS kernel triggers an interrupt, instantly waking the thread to process the data before returning to sleep.

**Entry 6: The Cross-Platform Pivot (Scrapping POSIX for Asio)**

During an architectural review of my initial raw POSIX C implementation, I identified a critical deployment flaw: manually hardcoding `kqueue` and `fcntl` system calls permanently locked the codebase to macOS. To build a true, shippable product, the system needed to be platform-agnostic. I made the decision to scrap the raw C infrastructure and pivot to Standalone Asio. While writing raw POSIX code was an invaluable academic exercise in understanding kernel-level file descriptors, Asio abstracts the OS-specific event loops (`epoll` on Linux, `IOCP` on Windows) dynamically at compile time. This delegates the dangerous C-style memory management to the library, allowing me to manage network lifecycles using modern C++ paradigms like RAII, smart pointers, and lambdas.

---

## Implementation Journey

**Entry 7: Strict Test-Driven Development (TDD) for Systems**

Before writing the core network logic, I built a comprehensive TDD suite using Google Test and CMake. The first crucial tests verify object initialization and OS-level socket binding, ensuring that any attempt to bind to an already-occupied port gracefully throws a `std::runtime_error` rather than silently crashing.

**Entry 8: TOCTOU and Two-Phase Initialization**

To make the system production-ready, I had to prevent a Time-of-Check to Time-of-Use (TOCTOU) race condition. I initially considered verifying port availability directly inside the Node constructor. However, I realized that in the microsecond between checking the port and actually using it, another process could steal it, leading to a fatal crash. I implemented Two-Phase Initialization: setting up the memory state in the constructor, but delaying the dangerous OS socket binding to the explicit `start_server()` phase to handle network failures exactly when they happen.

**Entry 9: Architectural Separation of Concerns**

Splitting the network logic into distinct `Node` and `Peer` boundaries prevents a monolithic anti-pattern and massive compilation overhead. The `Node` acts as the manager holding an `unordered_map` of active connections, while the `Peer` handles strict protocol framing. Wrapping the `Peer` lifecycle in `std::shared_ptr` provides instantaneous, leak-free teardown of disconnected clients. Bypassing manual memory deallocation is a sharp contrast to the precise pointer arithmetic and intrusive free lists required when designing custom slab memory allocators, allowing total focus to remain on the application's network layer.

**Entry 10: The Physics of the `io_context`**

To avoid wasting RAM by storing duplicate memory pointers across thousands of potential connections, the `Peer` class does not hold a reference to the `io_context`. Instead, the Asio socket physically swallows the executor at birth, permanently fusing itself to the event loop. The `Node` owns the engine, but the `Peer` routes network requests seamlessly through its internal socket wiring.

**Entry 11: Encapsulation and the Testing Paradox**

A core tension emerged between writing isolated unit tests and maintaining bulletproof security perimeters. Exposing state setters and byte trackers as `public` compromises protocol safety. Implementing GoogleTest's `FRIEND_TEST` macro resolved this, granting the test suite exclusive compiler authorization to drive private state changes while mathematically locking out external callers in a production build.

**Entry 12: Precision Timekeeping for Network Defense**

During the TDD blueprinting phase, a critical physical requirement was identified for timeout defenses. While the global stopwatch for resource cleanup correctly lives in the `Node` to preserve CPU cycles, each `Peer` must own an internal `std::chrono::steady_clock::time_point`. This variable acts as a microscopic timestamp, providing the exact precision needed to calculate idle durations and ruthlessly drop Slowloris and Ghost Peer connections.

**Entry 13: Bypassing the Endianness Illusion and Preserving Cross-Platform Purity**

When implementing network serialization to construct a 4-byte big-endian header for payloads, I encountered a cognitive speedbump: extracting bytes mathematically from top-to-bottom (`len >> 24`, `>> 16`, etc.) visually looks like forward progression, not a "swap." The breakthrough was realizing that bitwise operators work strictly on the mathematical *Value Representation* in the CPU register, completely bypassing the physical *Object Representation* (little-endian layout) in RAM. More importantly, this approach perfectly preserved the architectural pivot made in **Entry 6**. I initially considered using the POSIX `htonl()` function to swap bytes, but realized doing so would force me to import OS-specific headers (`<arpa/inet.h>` for Unix, `<winsock2.h>` for Windows). This would have resurrected the exact platform lock-in I had just eliminated by moving to Asio. I also rejected the C++23 `std::byteswap` to keep the codebase accessible to older compilers. Pure bit-shifting remains the most bulletproof, universally CPU-agnostic method to force big-endian output without compromising the cross-platform mandate.

**Entry 14: Data Construction vs. Pointer Casting**

Flowing from the endianness breakthrough in Entry 13, I established an immutable architectural rule for the wire protocol: data destined for the network must always be mathematically constructed byte-by-byte into a transmission buffer rather than blasted via `reinterpret_cast<uint8_t*>`, raw `std::memcpy` of multi-byte types, or C-style type punning. Casting pointers essentially leaks the host hardware's internal physical RAM layout into the network protocol, creating fragile, architecture-dependent code plagued by three fatal traps: invisible compiler padding bytes inserted for hardware word alignment, strict aliasing rule violations when reinterpreting buffers, and undefined behavior stemming from unaligned memory reads on strict architectures like ARM. By explicitly slicing multi-byte integers into discrete 8-bit pieces using arithmetic shifts (`>> 24`, `>> 16`, `>> 8`, `& 0xFF`) and pushing them sequentially into a `std::vector<uint8_t>`, the program forces the container to guarantee contiguous index ordering. This completely bypasses the CPU's native memory-mapping quirks and compiler optimizations, ensuring that every framed packet conforms mathematically and deterministically to the wire protocol regardless of the operating system or processor architecture compiling the codebase.

**Entry 15: Opcode Expansion, The TDD Spiral, and Test Spies**

What started as a straightforward testing phase quickly snowballed into a massive architectural audit. My initial wire protocol was minimal—just basic handshakes and ping commands. However, as I mapped out real peer-to-peer data exchange, the specification rapidly grew into an exhaustive matrix of 14 distinct opcodes to support chunk requests, inventory announcements (`Have`/`Bitfield`), tit-for-tat choke states, and peer discovery. As the protocol expanded, running unit tests exposed deep architectural blind spots: testing one command revealed security vulnerabilities in another. For instance, testing `SendData` made me realize a rogue client could request file blocks before authenticating. This triggered a full-blown TDD spiral, forcing me to build an uncompromising suite of security traps: a "Strict Bouncer" state gate, geometric boundary checks for malformed data, zero-length keep-alive handlers, and protection against dropped-socket memory leaks (the "Dead Phone" scenario). This spiral also revealed that my tests were biased entirely toward incoming traffic, completely neglecting the outbound transport layer. To verify outbound reliability, I architected an internal transmission queue and wrote tests proving `send_message()` calculates and attaches the 4-byte big-endian length prefix before handing data to Asio. Verifying this internal behavior without compromising encapsulation required overhauling `Peer.hpp` with dedicated "Spy Functions"—read-only inspectors exposing queue state, parsed IPs, and extracted offsets. This proved especially vital for `PeerList` (0x07), where strict byte validation rejects non-6-byte multiples to prevent out-of-bounds reads. Adding these spies transformed the `Peer` from an opaque socket wrapper into a mathematically verifiable state machine, proving that real protocol design is an iterative battle against edge cases.
"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { journals } from "@/lib/journals";

// Set to "" to hide the Download CV button.
const CV_URL = "/Agam_Cohen_CV_UK.pdf";

const GITHUB_URL = "https://github.com/agamlaugh";
const LINKEDIN_URL = "https://www.linkedin.com/in/agam-rain-cohen/";

const PAPER = {
  title: "Building belonging: evaluating a student-led peer-support scheme in Computer Science",
  authors: "Vincent Danys, Agam Cohen, Elisa Fracticelli, Lewis Simpson, Anastasia Trainor, Fiona McNeill",
  venue: "Proceedings of the 10th Computing Education Practice",
  year: "2026",
  url: "https://dl.acm.org/doi/10.1145/3772338.3772345",
};

const projects = [
  {
    title: "Custom Memory Allocator",
    status: "Complete",
    description:
      "A heap allocator built from scratch, replacing malloc/free with a slab allocator on top of mmap/munmap. Segregated free lists give O(1) allocation and recycling, and intrusive free lists remove per-block metadata. Built test-first; the test suite caught an integer overflow in the large-allocation path. Benchmarked against malloc with Google Benchmark: 3–6× faster on small objects, about 100× slower on 4KB objects, where every request makes its own mmap call.",
    tags: ["C++17", "POSIX mmap", "TDD", "Google Benchmark"],
    repoUrl: "https://github.com/agamlaugh/custom-memory-allocator",
    journalSlug: "memory-allocator",
  },
  {
    title: "Distributed P2P Node",
    status: "In progress",
    description:
      "An asynchronous peer-to-peer node for BitTorrent-style chunk exchange. Designed around a single-threaded event loop on Standalone Asio, with a length-prefixed wire protocol (14 message types) and hardening against malicious peers: handshake gating and payload size limits, with timeout policies next. Developed test-first with Google Test and run under AddressSanitizer.",
    tags: ["C++17", "Asio", "Google Test", "CMake", "AddressSanitizer"],
    repoUrl: "https://github.com/agamlaugh/p2p-node",
    journalSlug: "p2p-node",
  },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const linkStyle = `underline underline-offset-4 decoration-neutral-600 hover:decoration-white hover:text-white transition-colors rounded-sm ${focusRing}`;

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center p-8 font-sans">
      <main className="w-full flex flex-col items-center">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl text-center space-y-6 mt-20 mb-32"
        >
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Agam Rain Cohen
          </h1>
          <p className="text-xl text-neutral-400 font-mono">
            BSc Computer Science, University of Edinburgh · 2027
          </p>
          <p className="text-neutral-500 max-w-xl mx-auto">
            I build software from first principles, with a focus on systems:
            memory management, networking, and the operating-system ideas
            underneath them.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-8">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-neutral-200 transition-colors ${focusRing}`}
            >
              GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`border border-neutral-700 px-6 py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors ${focusRing}`}
            >
              LinkedIn
            </a>
            {CV_URL && (
              <a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`border border-neutral-700 px-6 py-3 rounded-md font-medium hover:bg-neutral-800 transition-colors ${focusRing}`}
              >
                Download CV
              </a>
            )}
          </div>
        </motion.section>

        {/* Projects Section */}
        <motion.section
          id="projects"
          aria-labelledby="projects-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-5xl w-full space-y-8 pb-20"
        >
          <h2
            id="projects-heading"
            className="text-2xl font-bold text-white border-b border-neutral-800 pb-4"
          >
            Selected Projects
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <article
                key={project.title}
                className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg hover:border-neutral-600 transition-colors flex flex-col h-full"
              >
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-neutral-400 mt-2 text-xs font-mono uppercase">
                  {project.status}
                </p>
                <p className="text-neutral-300 mt-4 text-sm leading-relaxed flex-grow">
                  {project.description}
                </p>
                <ul className="flex flex-wrap gap-2 pt-6 mt-auto" aria-label="Technologies">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-xs font-mono bg-neutral-800 text-neutral-300 px-2 py-1 rounded"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-6 pt-6 text-sm text-neutral-300">
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkStyle}
                  >
                    Repository
                  </a>
                  <Link href={`/journals/${project.journalSlug}`} className={linkStyle}>
                    Journal
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        {/* Publication Section */}
        <motion.section
          id="publication"
          aria-labelledby="publication-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="max-w-5xl w-full space-y-8 pb-20"
        >
          <h2
            id="publication-heading"
            className="text-2xl font-bold text-white border-b border-neutral-800 pb-4"
          >
            Publication
          </h2>
          <article className="bg-neutral-900 border border-neutral-800 p-8 rounded-lg hover:border-neutral-600 transition-colors">
            <h3 className="text-xl font-bold text-white">
              <a
                href={PAPER.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`rounded-sm hover:underline underline-offset-4 ${focusRing}`}
              >
                {PAPER.title}
              </a>
            </h3>
            <p className="text-neutral-400 mt-2 text-xs font-mono">
              {PAPER.venue} · {PAPER.year}
            </p>
            <p className="text-neutral-300 mt-4 text-sm leading-relaxed">
              {PAPER.authors}
            </p>
          </article>
        </motion.section>

        {/* Engineering Journals Section */}
        <motion.section
          id="journals"
          aria-labelledby="journals-heading"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="max-w-5xl w-full space-y-8 pb-20"
        >
          <h2
            id="journals-heading"
            className="text-2xl font-bold text-white border-b border-neutral-800 pb-4"
          >
            Engineering Journals
          </h2>
          <p className="text-neutral-400 max-w-2xl">
            For each project I keep a decision log: what I planned, what I
            rejected and why, and the bugs that changed my mind.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {journals.map((journal) => (
              <article
                key={journal.slug}
                className="relative bg-neutral-900 border border-neutral-800 p-8 rounded-lg hover:border-neutral-600 focus-within:border-neutral-600 transition-colors flex flex-col h-full"
              >
                <h3 className="text-xl font-bold text-white">
                  <Link
                    href={`/journals/${journal.slug}`}
                    className={`rounded-sm after:absolute after:inset-0 after:content-[''] ${focusRing}`}
                  >
                    {journal.title}
                  </Link>
                </h3>
                <p className="text-neutral-400 mt-2 text-xs font-mono">
                  {journal.project}
                </p>
                <p className="text-neutral-300 mt-4 text-sm leading-relaxed">
                  {journal.summary}
                </p>
              </article>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className="max-w-5xl w-full border-t border-neutral-800 py-8 text-sm text-neutral-500">
        © {new Date().getFullYear()} Agam Rain Cohen
      </footer>
    </div>
  );
}

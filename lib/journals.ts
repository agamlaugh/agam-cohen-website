export type Journal = {
  slug: string;
  title: string;
  project: string;
  file: string;
  summary: string;
  repoUrl: string;
};

export const journals: Journal[] = [
  {
    slug: "memory-allocator",
    file: "memory-allocator.md",
    title: "Memory Allocator: Decision Log",
    project: "custom-memory-allocator",
    summary:
      "Why I rejected Next-Fit and Best-Fit, pivoted to slab allocation, benchmarked it against malloc, and found a flaw in my own API.",
    repoUrl: "https://github.com/agamlaugh/custom-memory-allocator",
  },
  {
    slug: "p2p-node",
    file: "p2p-node.md",
    title: "P2P Node: Decision Log",
    project: "p2p-node",
    summary:
      "Choosing a single-threaded async design over thread-per-peer, moving from raw POSIX to Asio, and building the wire protocol test-first.",
    repoUrl: "https://github.com/agamlaugh/p2p-node",
  },
];

export function getJournal(slug: string): Journal | undefined {
  return journals.find((j) => j.slug === slug);
}

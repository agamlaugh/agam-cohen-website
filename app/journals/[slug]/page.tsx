/* react-markdown passes a `node` prop that must not reach the DOM, so each renderer drops it. */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { readFile } from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import { getJournal, journals } from "@/lib/journals";

export const dynamicParams = false;

export function generateStaticParams() {
  return journals.map((journal) => ({ slug: journal.slug }));
}

export async function generateMetadata(
  props: PageProps<"/journals/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const journal = getJournal(slug);
  if (!journal) return {};
  return {
    title: journal.title,
    description: journal.summary,
    openGraph: { title: journal.title, description: journal.summary },
  };
}

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const components: Components = {
  h2: ({ node: _node, ...props }) => (
    <h2
      className="text-2xl font-bold text-white border-b border-neutral-800 pb-3 mt-14 mb-6"
      {...props}
    />
  ),
  h3: ({ node: _node, ...props }) => (
    <h3 className="text-xl font-bold text-white mt-10 mb-3" {...props} />
  ),
  // Entries are a bold title followed by body text. Making a leading bold title
  // a block puts it on its own line, whether or not a blank line follows it.
  p: ({ node: _node, ...props }) => (
    <p
      className="text-neutral-300 leading-relaxed mb-6 [&>strong:first-child]:block [&>strong:first-child]:mb-2"
      {...props}
    />
  ),
  strong: ({ node: _node, ...props }) => (
    <strong className="font-semibold text-white" {...props} />
  ),
  ul: ({ node: _node, ...props }) => (
    <ul className="list-disc pl-6 mb-6 space-y-3 text-neutral-300" {...props} />
  ),
  ol: ({ node: _node, ...props }) => (
    <ol className="list-decimal pl-6 mb-6 space-y-3 text-neutral-300" {...props} />
  ),
  li: ({ node: _node, ...props }) => (
    <li className="leading-relaxed" {...props} />
  ),
  code: ({ node: _node, ...props }) => (
    <code
      className="font-mono text-sm bg-neutral-800 text-neutral-200 px-1.5 py-0.5 rounded"
      {...props}
    />
  ),
  a: ({ node: _node, href, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline underline-offset-4 decoration-neutral-600 hover:decoration-white rounded-sm ${focusRing}`}
      {...props}
    />
  ),
  hr: ({ node: _node, ...props }) => (
    <hr className="border-neutral-800 my-10" {...props} />
  ),
};

export default async function JournalPage(props: PageProps<"/journals/[slug]">) {
  const { slug } = await props.params;
  const journal = getJournal(slug);
  if (!journal) notFound();

  const markdown = await readFile(
    path.join(process.cwd(), "content", "journals", journal.file),
    "utf8",
  );

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 px-6 py-16 font-sans">
      <article className="max-w-2xl mx-auto">
        <Link
          href="/#journals"
          className={`text-sm font-mono text-neutral-400 hover:text-white transition-colors rounded-sm ${focusRing}`}
        >
          ← Back to journals
        </Link>

        <header className="mt-8 mb-12 space-y-4">
          <p className="text-xs font-mono text-neutral-400">{journal.project}</p>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            {journal.title}
          </h1>
          <p className="text-neutral-400">{journal.summary}</p>
          <a
            href={journal.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block text-sm text-neutral-300 underline underline-offset-4 decoration-neutral-600 hover:decoration-white rounded-sm ${focusRing}`}
          >
            View repository
          </a>
        </header>

        <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
      </article>
    </main>
  );
}

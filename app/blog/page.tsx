import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog - Newsletter Radar",
  description:
    "Practical writing on newsletter sponsorship intelligence, competitor footprints, and placement planning.",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-mono text-sm">
            <span className="text-accent">●</span>
            <span className="font-medium tracking-tight">newsletter radar</span>
          </Link>
          <Link href="/" className="font-mono text-xs text-muted transition-colors hover:text-foreground">
            back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16 lg:py-24">
        <p className="font-mono text-xs tracking-widest text-muted">BLOG</p>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Newsletter sponsorship decisions, without the guesswork.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Practical notes on competitor footprints, advertiser retention, and deciding where to spend.
        </p>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {posts.map((post) => (
            <article key={post.slug} className="py-8">
              <p className="font-mono text-xs text-muted">{formatDate(post.date)}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-accent">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-muted">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-5 inline-block font-mono text-xs text-accent transition-colors hover:text-foreground"
              >
                Read post →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

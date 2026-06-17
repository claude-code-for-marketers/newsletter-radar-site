import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

type Frontmatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  published?: unknown;
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asDateString(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return "";
}

function getSlugFromFilename(filename: string) {
  return filename.replace(/\.md$/, "");
}

async function getPostFilenames() {
  try {
    const filenames = await fs.readdir(BLOG_DIR);
    return filenames.filter((filename) => filename.endsWith(".md"));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function readPostFile(filename: string) {
  const raw = await fs.readFile(path.join(BLOG_DIR, filename), "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Frontmatter;

  return {
    meta: {
      slug: getSlugFromFilename(filename),
      title: asString(data.title, "Untitled"),
      description: asString(data.description),
      date: asDateString(data.date),
      published: data.published !== false,
    },
    content: parsed.content,
  };
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const filenames = await getPostFilenames();
  const posts = await Promise.all(filenames.map(readPostFile));

  return posts
    .map((post) => post.meta)
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const filename = `${slug}.md`;
  const filenames = await getPostFilenames();

  if (!filenames.includes(filename)) {
    return null;
  }

  const post = await readPostFile(filename);

  if (!post.meta.published) {
    return null;
  }

  const processed = await remark().use(html).process(post.content);

  return {
    ...post.meta,
    contentHtml: processed.toString(),
  };
}

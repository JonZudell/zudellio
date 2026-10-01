import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/**
 * A post is a markdown file in content/posts. Adding a post is adding a file;
 * nothing else in the app has to know about it.
 *
 * Front matter:
 *   title    the name the prompt prints: jon@zudell.io > hire_me v1.0.0
 *   version  the version beside the title
 *   author   the prompt's user, normally jon@zudell.io
 *   date     ISO timestamp; printed as epoch ms with the readable date as its title
 *   summary  markdown shown on the index card
 *   sticky   true for the one post pinned above the list
 */
export interface Post {
  slug: string;
  title: string;
  version: string;
  author: string;
  date: string;
  summary: string;
  body: string;
  sticky: boolean;
}

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function readPost(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(POSTS_DIR, fileName), 'utf8');
  const { data, content } = matter(raw);

  if (!data.title) throw new Error(`content/posts/${fileName}: front matter needs a title`);
  if (!data.date) throw new Error(`content/posts/${fileName}: front matter needs a date`);

  return {
    slug,
    title: String(data.title),
    version: String(data.version ?? 'v0.1.0'),
    author: String(data.author ?? 'jon@zudell.io'),
    date: new Date(data.date).toISOString(),
    summary: String(data.summary ?? '').trim(),
    body: content.trim(),
    sticky: data.sticky === true,
  };
}

export function allPosts(): Post[] {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
  return files
    .map(readPost)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** The pinned post, if any. */
export function stickyPost(): Post | undefined {
  return allPosts().find((p) => p.sticky);
}

/** Everything that is not pinned, newest first. */
export function listedPosts(): Post[] {
  return allPosts().filter((p) => !p.sticky);
}

export function getPost(slug: string): Post | undefined {
  return allPosts().find((p) => p.slug === slug);
}

/** The card prints the epoch and keeps the readable date in the tooltip. */
export function readableDate(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
}

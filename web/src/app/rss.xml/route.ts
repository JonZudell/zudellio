import { allPosts } from '@/lib/posts';

/** The feed, generated from the same markdown files the pages are. */
export const dynamic = 'force-static';

const SITE = 'https://zudell.io';

function escape(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function GET() {
  const posts = allPosts();
  const items = posts
    .map((post) => {
      const summary = post.summary.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
      return [
        '    <item>',
        `      <title>${escape(`${post.title} ${post.version}`)}</title>`,
        `      <link>${SITE}/posts/${post.slug}</link>`,
        `      <guid isPermaLink="true">${SITE}/posts/${post.slug}</guid>`,
        `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
        `      <description>${escape(summary)}</description>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>zudell.io</title>',
    `    <link>${SITE}</link>`,
    '    <description>misadventures in software</description>',
    '    <language>en-us</language>',
    `    <lastBuildDate>${new Date(posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

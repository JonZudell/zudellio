import { Marked } from 'marked';
import hljs from 'highlight.js/lib/common';

/**
 * Markdown to HTML, server side, with two deliberate departures from the
 * defaults:
 *
 *  - a fenced block becomes a titled box: ```js title="webpack.config.js"
 *    renders the header bar the old CodeBlock component drew.
 *  - an image is a bordered, shadowed plate like everything else on the page.
 *
 * Highlighting uses highlight.js's class names, coloured by the site's own
 * roles in globals.css — green is a comment, purple a keyword, pink a string.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const marked = new Marked({ gfm: true, breaks: false });

marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const info = (lang ?? '').trim();
      const language = info.split(/\s+/)[0] ?? '';
      const title = info.match(/title="([^"]*)"/)?.[1] ?? '';
      const known = language && hljs.getLanguage(language);
      const body = known
        ? hljs.highlight(text, { language, ignoreIllegals: true }).value
        : escapeHtml(text);
      const header = title
        ? `<div class="code-header">${escapeHtml(title)}</div>`
        : '';
      const codeClass = known ? `hljs language-${escapeHtml(language)}` : 'hljs';
      return `<div class="code-block">${header}<pre tabindex="0"><code class="${codeClass}">${body}</code></pre></div>`;
    },

    image({ href, title, text }: { href: string; title?: string | null; text: string }) {
      const t = title ? ` title="${escapeHtml(title)}"` : '';
      return `<img src="${escapeHtml(href)}" alt="${escapeHtml(text)}"${t} loading="lazy" />`;
    },
  },
});

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/** Inline markdown without the wrapping <p>, for card summaries that are one line. */
export function renderMarkdownBlock(md: string): string {
  return renderMarkdown(md);
}

export interface WidgetDirective {
  kind: 'widget';
  name: string;
  props: Record<string, string>;
}

export interface HtmlSegment {
  kind: 'html';
  html: string;
}

export type Segment = HtmlSegment | WidgetDirective;

const WIDGET_LINE = /^:::widget\s+(.+)$/;

/**
 * Posts are markdown, but three of them embed a live thing — a cellular
 * automaton, a physics toy, a form demonstrating the accessible inputs. A line
 *
 *     :::widget rule30 cellSize=16 width=150 height=100
 *
 * splits the body there and drops the named component in.
 */
export function toSegments(body: string): Segment[] {
  const segments: Segment[] = [];
  let buffer: string[] = [];

  const flush = () => {
    const md = buffer.join('\n').trim();
    if (md) segments.push({ kind: 'html', html: renderMarkdown(md) });
    buffer = [];
  };

  for (const line of body.split(/\r?\n/)) {
    const match = line.match(WIDGET_LINE);
    if (!match) {
      buffer.push(line);
      continue;
    }
    flush();
    const [name, ...rest] = match[1].trim().split(/\s+/);
    const props: Record<string, string> = {};
    for (const pair of rest) {
      const eq = pair.indexOf('=');
      if (eq > 0) props[pair.slice(0, eq)] = pair.slice(eq + 1).replace(/^"|"$/g, '');
    }
    segments.push({ kind: 'widget', name, props });
  }
  flush();

  return segments;
}

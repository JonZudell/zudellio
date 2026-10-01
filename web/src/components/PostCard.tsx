import type { ReactNode } from 'react';
import type { Post } from '@/lib/posts';
import { readableDate } from '@/lib/posts';

interface PostCardProps {
  post: Post;
  children: ReactNode;
  headingLevel?: 'h1' | 'h2';
}

/**
 * The box the whole site is made of: the page's own ground, two pixels of the
 * text colour around it, and the same colour again as an unblurred shadow half
 * an em down and right. The heading reads as a prompt —
 * `jon@zudell.io > hire_me v1.0.0` — and the stamp as a comment.
 */
export default function PostCard({ post, children, headingLevel = 'h2' }: PostCardProps) {
  const Heading = headingLevel;
  const epoch = new Date(post.date).getTime();
  return (
    <article className={`border-post${post.sticky ? ' sticked-post' : ''}`}>
      <Heading className="post-title">
        <span className="user-purple">{post.author}</span>
        {` > ${post.title} ${post.version}`}
      </Heading>
      <p className="post-stamp">
        # Posted
        <time dateTime={post.date} title={readableDate(post.date)}>
          {epoch}
        </time>
      </p>
      {children}
    </article>
  );
}

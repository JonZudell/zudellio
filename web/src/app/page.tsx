import CommandLink from '@/components/CommandLink';
import PostCard from '@/components/PostCard';
import { renderMarkdown } from '@/lib/markdown';
import { listedPosts, stickyPost } from '@/lib/posts';

function Summary({ summary }: { summary: string }) {
  return (
    <div
      className="post-body"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(summary) }}
    />
  );
}

export default function Home() {
  const sticky = stickyPost();
  const posts = listedPosts();

  return (
    <>
      {sticky ? (
        <>
          <h2 className="section-heading">sticked posts</h2>
          <PostCard post={sticky}>
            <Summary summary={sticky.summary} />
            <p className="post-actions">
              <CommandLink
                text="view_post"
                href={`/posts/${sticky.slug}`}
                ariaLabel={`View ${sticky.title}`}
                decorationLeft="< "
                decorationRight=" >"
              />
            </p>
          </PostCard>
        </>
      ) : null}

      <h2 className="section-heading">misadventures in software</h2>
      {posts.map((post) => (
        <PostCard key={post.slug} post={post}>
          <Summary summary={post.summary} />
          <p className="post-actions">
            <CommandLink
              text="view_post"
              href={`/posts/${post.slug}`}
              ariaLabel={`View ${post.title}`}
              decorationLeft="< "
              decorationRight=" >"
            />
          </p>
        </PostCard>
      ))}
    </>
  );
}

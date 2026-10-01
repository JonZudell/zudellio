import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CommandLink from '@/components/CommandLink';
import PostBody from '@/components/PostBody';
import PostCard from '@/components/PostCard';
import { allPosts, getPost } from '@/lib/posts';

export function generateStaticParams() {
  return allPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} ${post.version} — zudell.io`,
    description: post.summary.replace(/[*_`[\]]/g, '').slice(0, 200),
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const back = (
    <p>
      <CommandLink text="Back" href="/" ariaLabel="Go to the post list" decorationLeft="< " />
    </p>
  );

  return (
    <>
      {back}
      <PostCard post={post} headingLevel="h1">
        <PostBody body={post.body} />
      </PostCard>
      {back}
    </>
  );
}

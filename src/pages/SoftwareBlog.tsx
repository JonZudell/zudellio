import React from "react";
import { useParams } from "react-router-dom";
import A11y from "./posts/a11y";
import Authn from "./posts/authn";
import Init from "./posts/init";
import SSRWONode from "./posts/ssr_wo_node";

interface PostProps {
  displaySummary?: boolean;
}

const posts: { [key: string]: { component: React.FC<PostProps>; date: Date } } = {
  init: { component: Init, date: new Date('2024-08-30') },
  ssr_wo_node: { component: SSRWONode, date: new Date('2024-08-31') },
  authn: { component: Authn, date: new Date('2024-09-01') },
  a11y: { component: A11y, date: new Date('2024-09-01') },
};

const SoftwareBlog: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();
  // Convert posts object to an array and sort by date
  const sortedPosts = Object.entries(posts)
    .sort(([, a], [, b]) => b.date.getTime() - a.date.getTime())
    .map(([id, { component: Component, date }]) => (
      <li key={id}>
        <Component displaySummary={true} />
      </li>
    ));
  return (
    <>
      {postId ? (
        <div className="w-full">
          <h2>Blog Post {postId}</h2>
          {posts[postId]?.component && React.createElement(posts[postId].component, { displaySummary: false })}
        </div>
      ) : (
        <div className="w-full">
          <div className="flex justify-center items-center">
            <h2 className="text-xl">software misadventures</h2>
          </div>
          <ul>{sortedPosts}</ul>
        </div>
      )}
    </>
  );
};

export default SoftwareBlog;
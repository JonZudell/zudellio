import React from 'react';
import { useParams } from 'react-router-dom';
import HireMe from './posts/hire_me';
import { sortedPosts, sticked_post } from './_posts';

const Index: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();

  return (
    <div className="w-full">
      <div className="flex justify-center items-center">
        <h2 className="text-xl">sticked posts</h2>
      </div>
      {React.createElement(sticked_post, {
        displaySummary: true,
        classNames: 'stickied-post',
      })}
      <div className="flex justify-center items-center">
        <h2 className="text-xl">misadventures in software</h2>
      </div>
      <div>
        {sortedPosts.map((post, index) => (
          <div key={index}>
            {React.createElement(post.component, { displaySummary: true })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;

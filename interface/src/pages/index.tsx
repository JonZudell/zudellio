import React from 'react';
import { sortedPosts, sticked_post } from './_posts';

const Index: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex justify-center items-center">
        <h2 className="">sticked posts</h2>
      </div>
      {React.createElement(sticked_post, {
        displaySummary: true,
        classNames: 'stickied-post',
      })}
      <div className="flex justify-center items-center">
        <h2 className="">misadventures in software</h2>
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

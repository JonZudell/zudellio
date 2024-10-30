import React from 'react';

interface PostProps {
  displaySummary?: boolean;
}

const Post: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <div>
      {displaySummary ? (
        <h3>Post Summary</h3>
      ) : (
        <h3>It's a post</h3>
      )}
    </div>
  );
};

export default Post;
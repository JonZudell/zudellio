import React from 'react';
import Post from '../../components/containers/Post';

interface PostProps {
  displaySummary?: boolean;
}

const SSG: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-31T00:00:00Z')}
      title="js_modules"
      version="v0.1.0"
      postId="js_modules"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          Static Site Generation with webpack, react(-router), and TypeScript.
        </p>
      }
    >
      <p>This is the full content of the post.</p>
    </Post>
  );
};

export default SSG;

import React from 'react';
import Post from '../../components/Post';

interface PostProps {
  displaySummary?: boolean;
}

const SSRWONode: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-31T00:00:00Z')}
      title='ssr_wo_node'
      version='v0.1.0'
      postId='ssr_wo_node'
      displaySummary={displaySummary}
      summaryContent={<p>Server Side Rendering without a NodeJS Server</p>}
    >
      <p>This is the full content of the post.</p>
    </Post>
  );
};

export default SSRWONode;
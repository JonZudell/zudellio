import React from 'react';
import Post from '../../components/containers/Post';
interface PostProps {
  displaySummary?: boolean;
}

const Algebraic: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="algebraic"
      version="v0.0.0"
      postId="algebraic"
      displaySummary={displaySummary}
      summaryContent={<p></p>}
    ></Post>
  );
};

export default Algebraic;

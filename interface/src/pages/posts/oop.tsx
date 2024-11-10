import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';

interface PostProps {
  displaySummary?: boolean;
}

const ObjectOriented: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="oop"
      version="v0.1.0"
      postId="oop"
      displaySummary={displaySummary}
      summaryContent={<p></p>}
    ></Post>
  );
};

export default ObjectOriented;

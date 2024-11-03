import React from 'react';
import Post from '../../components/containers/Post';

interface PostProps {
  displaySummary?: boolean;
}

const Init: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title='init'
      version='v1.0.0'
      postId='init'
      displaySummary={displaySummary}
      summaryContent={<p>zudell.io. is live. Enjoy misadventures in software.</p>}
    >
      <p>zudell.io. is live. Enjoy misadventures in software. The purpose of most articles is to function as a living document containing my opinions on certain subjects. </p>
    </Post>
  );
};

export default Init;
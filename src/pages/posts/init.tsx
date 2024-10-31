import React from 'react';
import Post from '../../components/Post';

interface PostProps {
  displaySummary?: boolean;
}

const Init: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title='init'
      displaySummary={true}
      summaryContent={<p>zudell.io. is live. Enjoy misadventures in software. Ask yourself "if I've asked myself not if I can but if I should". Remember, todays jank is tomorrows encapsulation!!</p>}
      fullContent={<p>This is the full content of the post.</p>}
    />
  );
};

export default Init;
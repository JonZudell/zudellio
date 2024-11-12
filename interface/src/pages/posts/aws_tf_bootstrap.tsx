import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';
interface PostProps {
  displaySummary?: boolean;
}

const AWSTF: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="init"
      version="v1.0.0"
      postId="init"
      displaySummary={displaySummary}
      summaryContent={
        <p>zudell.io. is live. Enjoy misadventures in software.</p>
      }
    >
    </Post>
  );
};

export default AWSTF;

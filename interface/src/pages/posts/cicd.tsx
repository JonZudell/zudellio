import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';
interface PostProps {
  displaySummary?: boolean;
}

const CICD: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="cicd"
      version="v-1.0.0"
      postId="cicd"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          CI/CD is like a big rube goldberg machine where the first domino to
          fall is a push to your code repo and the last domino to fall is the
          production server.
        </p>
      }
    ></Post>
  );
};

export default CICD;

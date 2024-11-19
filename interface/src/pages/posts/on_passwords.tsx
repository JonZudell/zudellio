import React from 'react';
import Post from '../../components/containers/Post';
import AccessibleLink from '../../components/input/AccessibleLink';
interface PostProps {
  displaySummary?: boolean;
}

const OnPasswords: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-10-30T00:00:00Z')}
      title="on_passwords"
      version="v1.33.7"
      postId="on_passwords"
      displaySummary={displaySummary}
      summaryContent={<p></p>}
    >
      <p></p>
    </Post>
  );
};

export default OnPasswords;

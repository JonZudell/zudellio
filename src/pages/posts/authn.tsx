import React from 'react';
import Post from '../../components/Post';

interface PostProps {
  displaySummary?: boolean;
}

const Authn: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title='authn'
      postId='authn'
      displaySummary={displaySummary}
      summaryContent={<p>authn is authentication which is distinct from authorization or authz. Authentication is discussed in the context of a web application.</p>}
    >
      <p>Heyo</p>
      </Post>
  );
};

export default Authn;
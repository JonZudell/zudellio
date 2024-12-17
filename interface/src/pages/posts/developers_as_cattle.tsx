import React from 'react';
import Post from '../../components/containers/Post';

interface PostProps {
  displaySummary: boolean;
}

const DevsAsCattle: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="devs_as_cattle"
      version="v0.1.0"
      postId="devs_as_cattle"
      displaySummary={displaySummary}
      summaryContent={
        <p>
          devs_as_cattle is authentication which is distinct from authorization
          or authz. Authentication is discussed in the context of a web
          application.
        </p>
      }
    >
      <p>
        devs_as_cattle is authentication which is distinct from authorization or
        authz. Authentication is discussed in the context of a web application.
      </p>
    </Post>
  );
};

export default DevsAsCattle;

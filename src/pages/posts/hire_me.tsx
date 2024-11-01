import React from 'react';
import Post from '../../components/Post';

interface PostProps {
  displaySummary?: boolean;
  classNames?: string;
}

const HireMe: React.FC<PostProps> = ({ displaySummary = false, classNames }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title='hire_me'
      version='v1.0.0'
      postId='hire_me'
      displaySummary={displaySummary}
      summaryContent={<p>I am available for hire.</p>}
      classNames={classNames}
    >
      <p>Heyo</p>
    </Post>
  );
};

export default HireMe;
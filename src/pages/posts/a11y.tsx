import React from 'react';
import Post from '../../components/Post';

interface PostProps {
  displaySummary?: boolean;
}

const A11y: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title='a11y'
      postId='a11y'
      displaySummary={displaySummary}
      summaryContent={<p>Accessibility or a11y for short is the property of being usable by individuals with disabilities. </p>}
    >
      </Post>
  );
};

export default A11y;
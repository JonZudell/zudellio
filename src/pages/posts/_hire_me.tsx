import React from 'react';
import Post from '../../components/containers/Post';

interface PostProps {
  displaySummary?: boolean;
  summaryOnly?: boolean;
  classNames?: string;
}

const HireMe: React.FC<PostProps> = ({
  displaySummary = false,
  summaryOnly = true,
  classNames,
}) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title="hire_me"
      version="v1.0.0"
      postId="hire_me"
      displaySummary={displaySummary}
      summaryOnly={summaryOnly}
      summaryContent={
        <>
          <p>I am available for hire.</p>
          <h3 className="text-xl comment-green"># Software Rates</h3>
          <ul>
            <li>W2: $75/hr</li>
            <li>Consulting: $225/hr</li>
          </ul>
          <h3 className="text-xl comment-green"># Guitar Lesson Rates</h3>
          <ul>
            <li>First Lesson: 30 Minutes Free</li>
            <li>Subsequent Lessons: $25/hr</li>
          </ul>
        </>
      }
      classNames={classNames}
    ></Post>
  );
};

export default HireMe;

import React from 'react';
import Post from '../../components/containers/Post';
import Stimmy from '../../components/widget/Stimmy';

interface PostProps {
  displaySummary: boolean;
}

const EyeOfChaos: React.FC<PostProps> = ({ displaySummary = false }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-12-09T00:00:00Z')}
      title="eye_of_chaos"
      version="v0.1.0"
      postId="eye_of_chaos"
      displaySummary={displaySummary}
      summaryContent={
        <>
          <p>Gaze into the eye of chaos and tremble</p>
          <Stimmy></Stimmy>
        </>
      }
    >
      <>
        <p>Gaze into the eye of chaos and tremble</p>
        <Stimmy></Stimmy>
      </>
    </Post>
  );
};

export default EyeOfChaos;

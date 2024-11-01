import { Code } from '@deque/cauldron-react';
import React from 'react';
import Post from '../../components/Post';
interface PostProps {
  displaySummary?: boolean;
  classNames?: string;
}

const STPYV8Require: React.FC<PostProps> = ({ displaySummary = false, classNames }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title='stpyv8_require'
      version='v1.0.0'
      postId='stpyv8_require'
      displaySummary={displaySummary}
      summaryContent={<div>Individual Invoked Function Expression or IIFE modules are functions with the message signature.
        <Code language="javascript">
          {`// here are some vars
        var foo = true;
        const number = 1234;
        const string = "hello world";
        const regex = /^anything$/i;`}
        </Code>
      </div>}
      classNames={classNames}
    >
      <p>Heyo</p>
    </Post>
  );
};

export default STPYV8Require;
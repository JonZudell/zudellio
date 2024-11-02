import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import Post from '../../components/Post';
interface PostProps {
  displaySummary?: boolean;
  classNames?: string;
}

const code = `// individually invoked function expression
(function() {{
  // Code goes here
}})();`

const IIFEModule: React.FC<PostProps> = ({ displaySummary = false, classNames }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title='iife'
      version='v1.0.0'
      postId='iife'
      displaySummary={displaySummary}
      summaryContent={
        <div>
          <p>Individual Invoked Function Expression or IIFE modules are functions with the message signature.</p>
          <br />
          <CodeBlock code={code} title='iife.js' />
        </div>}
      classNames={classNames}
    >
      <CodeBlock code={code} title='iife.js' />
    </Post>
  );
};

export default IIFEModule;
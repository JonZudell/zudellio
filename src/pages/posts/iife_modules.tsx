import React from 'react';
import CodeBlock from '../../components/CodeBlock';
import Post from '../../components/Post';
interface PostProps {
  displaySummary?: boolean;
  classNames?: string;
}

const code = `// the iife module takes an object and modifies it in place
const module = { exports: {}}

// individually invoked function expression
(function(exports, require, module, __filename, __dirname) {{
  // Code goes here
}})(module.exports, require, module, 'filename', 'dirname');`

const IIFEModule: React.FC<PostProps> = ({ displaySummary = false, classNames }) => {
  return (
    <Post
      author="jon@zudell.io"
      date={new Date('2024-11-01T00:00:00Z')}
      title='iife_module'
      version='v1.0.0'
      postId='iife_module'
      displaySummary={displaySummary}
      summaryContent={
      <div>
        <p>Individual Invoked Function Expression or IIFE modules are functions with the message signature.</p>
        <br/>
        <CodeBlock code={code} title='iife_module.js'/>
      </div>}
      classNames={classNames}
    >
      <CodeBlock code={code} title='iife_module.js'/>
    </Post>
  );
};

export default IIFEModule;
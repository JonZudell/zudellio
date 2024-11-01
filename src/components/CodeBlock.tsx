import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './CodeBlock.css';

interface CodeBlockProps {
  code: string;
  title: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, title }) => (
  <div className='border-solid border-2 text-lg m-2em code-block'>
    <div className='border-b-2 border-solid text-center'>
      {title}
    </div>
    <SyntaxHighlighter language="javascript" showLineNumbers style={a11yDark}>
      {code}
    </SyntaxHighlighter>
  </div>
);

export default CodeBlock;
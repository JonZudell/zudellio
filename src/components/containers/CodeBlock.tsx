import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  a11yDark,
  darcula,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import './CodeBlock.css';

interface CodeBlockProps {
  code: string;
  title: string;
  className?: string;
  language?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  title,
  className,
  language = 'javascript',
  showLineNumbers = true,
}) => (
  <div className="text-lg m-1em code-block">
    <div className="text-center code-header">{title}</div>
    <SyntaxHighlighter
      className={`text-sm font-normal ${className}`}
      language={language}
      showLineNumbers={showLineNumbers}
      style={darcula}
    >
      {code}
    </SyntaxHighlighter>
  </div>
);

export default CodeBlock;

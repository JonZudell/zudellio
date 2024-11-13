import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  a11yDark,
  a11yLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTheme } from '../../contexts/ThemeProvider';
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
}) => {
  const { theme } = useTheme();
  const [syntaxTheme, setSyntaxTheme] = useState(a11yDark);

  useEffect(() => {
    setSyntaxTheme(theme === 'dark' ? a11yDark : a11yLight);
  }, [theme]);

  return (
    <div className="mb-2em code-block">
      <div className="text-center code-header">{title}</div>
      <SyntaxHighlighter
        className={`${className}`}
        language={language}
        showLineNumbers={showLineNumbers}
        style={syntaxTheme}
        lineProps={{
          style: { wordBreak: 'normal', whiteSpace: 'pre-wrap' },
        }}
        wrapLines={true}
        key={theme} // Force refresh when theme changes
        codeTagProps={{
          style: { fontWeight: '600' }, // Increased font weight
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

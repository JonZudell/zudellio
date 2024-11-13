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
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    setSyntaxTheme(theme === 'dark' ? a11yDark : a11yLight);
  }, [theme]);
  return (
    <div className="mb-2em code-block">
      {containerWidth < 400 ? (
        <div className="rotate-message">Rotate Screen to view code</div>
      ) : (
        <>
          <div className="text-center code-header">{title}</div>
          <SyntaxHighlighter
            className={`${className} max-w-screen-md`}
            language={language}
            showLineNumbers={showLineNumbers}
            style={syntaxTheme}
            lineProps={{
              style: { wordBreak: 'normal', whiteSpace: 'pre-wrap' },
            }}
            wrapLines={true}
            key={theme} // Force refresh when theme changes
            customStyle={{ overflowX: 'scroll' }} // Increased font weight and prevent overflow
            codeTagProps={{
              style: { fontWeight: '600' }, // Increased font weight
            }}
          >
            {code}
          </SyntaxHighlighter>
        </>
      )}
    </div>
  );
};

export default CodeBlock;

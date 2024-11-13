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
      {/* {containerWidth < 500 ? ( */}
      {containerWidth < 0 ? (
        <div className="rotate-message my-2em text-center">
          <div className="rotate-icon">🔄</div>
          <div>Rotate Screen to view code</div>
        </div>
      ) : (
        <>
          <div className="text-center code-header">{title}</div>
          <SyntaxHighlighter
            className={`${className}`} // Ensure max width is 100% of the container
            language={language}
            showLineNumbers={showLineNumbers}
            style={syntaxTheme}
            lineProps={{
              style: { wordBreak: 'break-all', whiteSpace: 'white-space-trim' },
            }}
            wrapLines={true}
            wrapLongLines={true}
            key={theme} // Force refresh when theme changes
            codeTagProps={{
              style: {
                fontWeight: '600',
                //fontSize: containerWidth < 500 ? '0.5em' : '1em',
              }, // Adjust font size for small screens
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

import React, { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  a11yDark,
  a11yLight,
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
}) => {
  const [theme, setTheme] = useState(a11yDark);

  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkThemeMq.matches ? a11yDark : a11yLight);

    const themeChangeListener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? a11yDark : a11yLight);
    };
    const themeProvider = document.documentElement.getAttribute('data-theme');
    if (themeProvider) {
      setTheme(themeProvider === 'dark' ? a11yDark : a11yLight);
    }
    darkThemeMq.addEventListener('change', themeChangeListener);

    return () => {
      darkThemeMq.removeEventListener('change', themeChangeListener);
    };
  }, []);

  return (
    <div className="mb-2em code-block">
      <div className="text-center code-header">{title}</div>
      <SyntaxHighlighter
        className={`${className}`}
        language={language}
        showLineNumbers={showLineNumbers}
        style={theme}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;

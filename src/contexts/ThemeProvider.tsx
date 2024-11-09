import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof document !== 'undefined') {
      const dataTheme = document.documentElement.getAttribute('data-theme');
      if (dataTheme === 'dark' || dataTheme === 'light') {
        return dataTheme as Theme;
      }
      const cookieMatch = document.cookie.match(/theme=(dark|light)/);
      if (cookieMatch) {
        return cookieMatch[1] as Theme;
      }
    }
    if (typeof window.matchMedia !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.cookie = `theme=${theme}; path=/; max-age=31536000`;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

import AccessibleButton from '../components/input/AccessibleButton';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [hidden, setHidden] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    hidden && setHidden(false);
  }, [hidden]);

  return (
    <AccessibleButton
      inputId="theme-toggle"
      onClick={toggleTheme}
      text={`${theme === 'light' ? 'dark' : 'light'}_mode`}
      ariaLabel={'Toggle Theme'}
      className={`${hidden ? 'hidden' : ''} w-36`}
    />
  );
};

export { ThemeProvider, ThemeToggle };

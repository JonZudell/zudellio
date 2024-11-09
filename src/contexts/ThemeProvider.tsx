import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

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
    if (typeof window.matchMedia === 'undefined') {
      return 'dark';
    }
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    return systemTheme;
  });

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
import AccessibleButton from '../components/input/AccessibleButton';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [hidden, setHidden] = useState(true);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  useEffect(() => {
    hidden && setHidden(false);
  }, [hidden]);
  return (
    <>
      <AccessibleButton
        inputId="theme-toggle"
        onClick={toggleTheme}
        text={`${theme === 'light' ? 'dark' : 'light'}_mode`}
        ariaLabel={'Toggle Theme'}
        className={`${hidden ? 'hidden' : ''} w-36`}
      />
    </>
  );
};
export { ThemeProvider, ThemeToggle };

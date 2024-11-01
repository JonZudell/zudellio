import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const container = document.getElementById('root');
const root = createRoot(container!); // Create a root.

const PreferredThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [preferredTheme, setPreferredTheme] = useState<string>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setPreferredTheme(mediaQuery.matches ? 'dark' : 'light');
    };

    handleChange(); // Set the initial theme
    mediaQuery.addEventListener('change', handleChange); // Listen for changes

    return () => {
      mediaQuery.removeEventListener('change', handleChange); // Cleanup listener on unmount
    };
  }, []);

  useEffect(() => {
    setTheme(preferredTheme);
  }, [preferredTheme, setTheme]);

  return <>{children}</>;
};

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <PreferredThemeProvider>
          <App />
        </PreferredThemeProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
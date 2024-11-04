import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

const container = document.getElementById('root');
const root = createRoot(container!); // Create a root.

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App theme={mediaQuery.matches ? 'dark' : 'light'}/>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
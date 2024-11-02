import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';

export function initializeApp() {
  const container = document.getElementById('root');
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const app = React.createElement(
    React.StrictMode,
    null,
    React.createElement(
      BrowserRouter,
      null,
      React.createElement(
        ThemeProvider,
        null,
        React.createElement(App, { theme: mediaQuery.matches ? 'dark' : 'light' })
      )
    )
  );

  if (container) {
    if (container.hasChildNodes()) {
      // hydrate root
      hydrateRoot(container, app);
    } else {
      // render root
      const root = createRoot(container);
      root.render(app);
    }
  } else {
    console.error('Root container not found');
  }
}
// Optionally, you can call the function immediately if you want to run it on script load
initializeApp();
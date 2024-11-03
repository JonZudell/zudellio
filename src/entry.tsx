import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Root from './components/Root';

export function hydrateApp() {
  const container = document.getElementById('root');
  if (container) {
    hydrateRoot(container, <Root path={window.location.pathname} />);
  }
}

// Optionally call the function to hydrate the app
hydrateApp();
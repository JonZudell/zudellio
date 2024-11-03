import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/core/Root';

export function hydrateApp() {
  const container = document.getElementById('root');
  if (container) {
    hydrateRoot(
      container, 
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    );
  }
}

// Optionally call the function to hydrate the app
hydrateApp();
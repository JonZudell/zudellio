import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/core/Root';
import './main.css';

export function hydrateApp() {
  const container = document.getElementById('root');
  console.log('hydrating');
  if (container) {
    hydrateRoot(
      container,
      <BrowserRouter>
        <Root />
      </BrowserRouter>,
    );
  }
}

// Ensure the function is called to hydrate the app
hydrateApp();

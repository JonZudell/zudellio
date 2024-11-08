import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/core/Root';
import './main.css';

const container = document.getElementById('root');
export function hydrateApp(container: HTMLElement | null) {
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

// Ensure the function to hydrate the app is called
hydrateApp(container);

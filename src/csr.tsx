import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from './components/core/Root';
import './main.css';

export const container = document.getElementById('root');

export function hydrateApp(container: HTMLElement | null) {
  if (container) {
    hydrateRoot(
      container,
      <BrowserRouter>
        <Root />
      </BrowserRouter>,
    );
  }
}

console.log('Window location:', window.location.href);
export const before = container?.innerHTML;
console.log('Container HTML before hydrate:', before);

hydrateApp(container);
export const after = container?.innerHTML;
console.log('Container HTML after hydrate:', after);
if (before !== after) {
  console.log('HTML content has changed after hydration.');
} else {
  console.log('HTML content remains the same after hydration.');
}

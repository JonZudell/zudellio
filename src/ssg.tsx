import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Root from './components/core/Root';
import './main.css';
declare global {
  // eslint-disable-next-line no-var
  var __webpack_public_path__: string;
}

if (typeof window !== 'undefined' && window.location) {
  __webpack_public_path__ = window.location.origin + '/';
} else {
  __webpack_public_path__ = '/'; // Set a default publicPath for static generation
}

interface Locals {
  path: string;
  [key: string]: any;
}

export default function (locals: Locals) {
  const html = renderToStaticMarkup(
    <StaticRouter location={locals.path}>
      <Root />
    </StaticRouter>,
  );

  return `${html}`; // Ensure it returns a valid HTML string
}

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import Root from './components/core/Root';

interface Locals {
  path: string;
  [key: string]: any;
}

export default function(locals: Locals) {
  const html = renderToStaticMarkup(
    <StaticRouter location={locals.path}>
      <Root />
    </StaticRouter>
  );
  return `<!DOCTYPE html>${html}`; // Ensure it returns a valid HTML string
}

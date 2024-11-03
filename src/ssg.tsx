import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Root from './components/Root';

interface Locals {
  path: string;
  [key: string]: any;
}

export default function(locals: Locals) {
  const html = renderToStaticMarkup(<Root {...locals} />);
  return `<!DOCTYPE html>${html}`; // Ensure it returns a valid HTML string
}

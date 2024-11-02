import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Root from './components/Root';

interface Locals {
  path: string;
  [key: string]: any;
}

export default function render(locals: Locals, callback: (error: Error | null, result?: string) => void) {
  const html = renderToStaticMarkup(<Root {...locals} />);
  callback(null, '<!DOCTYPE html>' + html);
}

import 'core-js/stable';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import 'regenerator-runtime/runtime';
import App from './App';
function renderApp(initialData: any, location: string): string {
  return ReactDOMServer.renderToString(<App initialData={initialData} location={location} />);
}

export default renderApp;
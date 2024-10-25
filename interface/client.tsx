import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import Root from './src/Root'; // Adjust the import path as necessary

const initialData = (window as any).__INITIAL_DATA__;

hydrateRoot(document.getElementById('root')!, <Root initialData={initialData} />);
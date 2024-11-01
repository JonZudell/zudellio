import React from 'react';
import '../pages/index.css';

interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <main className="p-4 flex w-full max-w-screen-lg mx-auto">
    {children}
  </main>
);

export default Content;
import React from 'react';

interface ContentProps {
  children: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <main className="p-4 flex justify-center">
    {children}
  </main>
);

export default Content;
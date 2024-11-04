import React from 'react';

interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <div className="p-4 flex w-full max-w-screen-lg mx-auto">{children}</div>
);

export default Content;

import React from 'react';

interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <div className="flex max-w-screen-md mx-auto w-md">{children}</div>
);

export default Content;

import React from 'react';

interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <div className="flex max-w-screen-md mx-auto w-md">
    <div className="m-0_5em">{children}</div>
  </div>
);

export default Content;

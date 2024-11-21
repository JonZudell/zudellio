import React from 'react';
import './Content.css';
interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <div className="flex max-w-screen-md w-md mx-auto">{children}</div>
);

export default Content;

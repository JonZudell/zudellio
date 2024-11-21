import React from 'react';
import './Content.css';
interface ContentProps {
  children?: React.ReactNode;
}

const Content: React.FC<ContentProps> = ({ children }) => (
  <div className="flex content-wrapper w-md md:mx-auto">{children}</div>
);

export default Content;

import React from 'react';
import '../../main.css';
import './Wrapper.css';
interface PostProps {
  children?: React.ReactNode;
  classNames?: string;
  style?: React.CSSProperties;
}

const Wrapper: React.FC<PostProps> = ({ classNames, children, style }) => {
  return (
    <div
      style={{ ...style }}
      className={`border-wrapper wrapper bg-standard-background ${classNames}`}
    >
      {children}
    </div>
  );
};

export default Wrapper;

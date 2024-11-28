import React from 'react';
import '../../main.css';
import './Wrapper.css';
interface PostProps {
  children?: React.ReactNode;
  classNames?: string;
}

const Wrapper: React.FC<PostProps> = ({ classNames, children }) => {
  return (
    <div
      className={`border-wrapper wrapper bg-standard-background ${classNames}`}
    >
      {children}
    </div>
  );
};

export default Wrapper;

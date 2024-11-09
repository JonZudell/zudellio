import React from 'react';
import { useLocation } from 'react-router-dom';
import AccessibleLink from '../input/AccessibleLink';
import './Header.css'; // Assuming you have a CSS file for styles

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <header className="p-4 text-center">
      <h1 className="">
        zudell.io.<span className="blinking-cursor" aria-hidden="true"></span>
      </h1>
      <nav className="">
        <AccessibleLink
          text="software"
          href="/"
          ariaLabel='Software'
          decorationLeft="["
          decorationRight="]"
          className={
            location.pathname === '/' ||
            location.pathname === '/iframe.html' ||
            location.pathname.startsWith('/post')
              ? 'text-pink-300 underline'
              : 'hover:underline'
          }
        />
        <AccessibleLink
          text="contact"
          href="/contact"
          ariaLabel='Contact'
          decorationLeft="["
          decorationRight="]"
          className={
            location.pathname === '/contact' ||
            location.pathname === '/contact/'
              ? 'text-pink-300 underline'
              : 'hover:underline'
          }
        />
      </nav>
    </header>
  );
};
export default Header;

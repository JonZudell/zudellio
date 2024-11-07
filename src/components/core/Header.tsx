import React from 'react';
import { useLocation } from 'react-router-dom';
import AccessibleLink from '../input/AccessibleLink';
import './Header.css'; // Assuming you have a CSS file for styles

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <header className="p-4 text-center">
      <h1 className="text-xl">
        zudell.io.<span className="blinking-cursor" aria-hidden="true"></span>
      </h1>
      <nav className="text-lg">
        <AccessibleLink
          text="software"
          href="/"
          decorationLeft="["
          decorationRight="]"
          className={
            location.pathname === '/' || location.pathname.startsWith('/blog')
              ? 'text-pink-300 underline'
              : 'hover:underline'
          }
        />
        <AccessibleLink
          text="contact"
          href="/contact"
          decorationLeft="["
          decorationRight="]"
          className={
            location.pathname === '/contact'
              ? 'text-pink-300 underline'
              : 'hover:underline'
          }
        />
      </nav>
    </header>
  );
};
export default Header;

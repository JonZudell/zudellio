import React from 'react';
import { useLocation } from 'react-router-dom';
import AccessibleLink from '../input/AccessibleLink';
import './Header.css'; // Assuming you have a CSS file for styles

const Header: React.FC = () => {
  const location = useLocation();
  return (
    <header className="p-4 text-center focus-within:z-10">
      <h1 className="text-xl">
        zudell.io.<span className="blinking-cursor" aria-hidden="true"></span>
      </h1>
      <nav className="text-lg">
        <ul
          className="flex justify-center"
          style={{ paddingLeft: '0.5em', paddingRight: '0.5em' }}
        >
          <li>
            <AccessibleLink
              text="software"
              href="/"
              decorationLeft="["
              decorationRight="]"
              className={
                location.pathname === '/' ||
                location.pathname.startsWith('/blog')
                  ? 'text-pink-300 underline'
                  : 'hover:underline'
              }
            />
          </li>
          {/* <li>
            <AccessibleLink
              text="music"
              onClick={() => navigate('/music')}
              decorationLeft='['
              decorationRight=']'
              className={location.pathname === '/music' ? 'text-pink-300 underline' : 'hover:underline'} />
          </li> */}
          <li>
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
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Header;

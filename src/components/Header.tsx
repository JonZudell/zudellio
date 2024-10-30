import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'; // Assuming you have a CSS file for styles

const Header: React.FC = () => (
  <header className="p-4 text-center">
    <h1 className="text-3xl">
      zudell.io.<span className="blinking-cursor" aria-hidden="true"></span>
    </h1>
    <nav>
      <ul className="flex justify-center space-x-4">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-blue-500' : 'hover:underline'
            }
            end
          >
            blog
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-blue-500' : 'hover:underline'
            }
          >
            about
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-blue-500' : 'hover:underline'
            }
          >
            contact
          </NavLink>
        </li>
      </ul>
    </nav>
  </header>
);
export default Header;
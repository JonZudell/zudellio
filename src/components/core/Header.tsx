import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../input/Button';
import './Header.css'; // Assuming you have a CSS file for styles

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <header className="p-4 text-center">
      <h1 className="text-xl">
        zudell.io.<span className="blinking-cursor" aria-hidden="true"></span>
      </h1>
      <nav className='text-lg'>
        <ul
          className="flex justify-center"
          style={{ paddingLeft: "0.5em", paddingRight: "0.5em" }}>
          <li>
            <Button
              text="software"
              onClick={() => navigate('/')}
              decorationLeft='['
              decorationRight=']'
              className={location.pathname === '/' || location.pathname.startsWith("/blog") ? 'text-pink-300 underline' : 'hover:underline'} />
          </li>
          <li>
            <Button
              text="music"
              onClick={() => navigate('/about')}
              decorationLeft='['
              decorationRight=']'
              className={location.pathname === '/music' ? 'text-pink-300 underline' : 'hover:underline'} />
          </li>
          <li>
            <Button
              text="contact"
              onClick={() => navigate('/contact')}
              decorationLeft='['
              decorationRight=']'
              className={location.pathname === '/contact' ? 'text-pink-300 underline' : 'hover:underline'} />
          </li>
        </ul>
      </nav>
    </header>
  )
};
export default Header;
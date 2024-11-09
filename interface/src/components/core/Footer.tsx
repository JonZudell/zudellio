import React from 'react';
import { ThemeToggle } from '../../contexts/ThemeProvider';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center">
      <ThemeToggle />
      <p>&copy; 2024 zudell.io. All rights reserved.</p>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { ThemeToggle } from '../../contexts/ThemeProvider';

const Footer: React.FC = () => {
  return (
    <footer className="p-4 text-center">
      <ThemeToggle />
      <p>&copy; 2024 zudell.io. ALL YOUR BASE ARE BELONG TO US.</p>
    </footer>
  );
};

export default Footer;

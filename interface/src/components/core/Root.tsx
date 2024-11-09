import React from 'react';
import Paths from './Paths';
import Content from './Content';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider } from '../../contexts/ThemeProvider';

const Root: React.FC = () => (
  <ThemeProvider>
    <Header />
    <Content>
      <Paths />
    </Content>
    <Footer />
  </ThemeProvider>
);

export default Root;

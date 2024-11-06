import React from 'react';
import Paths from './Paths';
import Content from './Content';
import Header from './Header';
import Footer from './Footer';

const Root: React.FC = () => (
  <main id={'main'}>
    <Header />
    <Content>
      <Paths />
    </Content>
    <Footer />
  </main>
);

export default Root;

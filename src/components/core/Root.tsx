import React from 'react';
import Paths from './Paths';
import Content from './Content';
import Header from './Header';
import Footer from './Footer';

const Root: React.FC = () => (
  <>
    <Header />
    <Content>
      <Paths />
    </Content>
    <Footer />
  </>
);

export default Root;

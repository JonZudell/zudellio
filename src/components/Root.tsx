import React from 'react';
import { StaticRouter } from 'react-router-dom/server';
import Paths from './Paths';
import Content from './Content';
import Header from './Header';
import Footer from './Footer';


const Root: React.FC<{}> = () => (
  <Content>
    <Header />
    <Paths />
    <Footer />
  </Content>
);

export default Root;

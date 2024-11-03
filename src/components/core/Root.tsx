import React from 'react';
import Paths from '../containers/Paths';
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

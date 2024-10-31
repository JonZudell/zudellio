import React from 'react';
import { Route, Routes } from 'react-router-dom';
import About from '../pages/About';
import Contact from '../pages/Contact';
import SoftwareBlog from '../pages/SoftwareBlog';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

const NoContext: React.FC = () => (
  <div className="">
    <Header />
    <Content>
      <Routes>
        <Route path="/" element={<SoftwareBlog />} />
        <Route path="/blog/:postId" element={<SoftwareBlog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Content>
    <Footer />
  </div>
);

export default NoContext;
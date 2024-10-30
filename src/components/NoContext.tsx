import React from 'react';
import { Route, Routes } from 'react-router-dom';
import About from '../pages/About';
import Blog from '../pages/Blog';
import Contact from '../pages/Contact';
import Footer from './Footer';
import Header from './Header';

const NoContext: React.FC = () => (
  <div className="flex flex-col">
    <Header />
    <Routes>
      <Route path="/" element={<Blog />} />
      <Route path="/blog/:postId" element={<Blog />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    <Footer />
  </div>
);

export default NoContext;
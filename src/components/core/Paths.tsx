import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../../pages/index';
import Contact from '../../pages/contact';
import _Post from '../../pages/_posts';

const Paths: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/posts/:postId" element={<_Post />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Paths;

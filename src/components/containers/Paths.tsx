import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../../pages';
import Contact from '../../pages/contact';

const Paths: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/blog/:postId" element={<Index />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Paths;

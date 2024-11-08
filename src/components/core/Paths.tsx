import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '../../pages/index';
import Contact from '../../pages/contact';
import _Post from '../../pages/_posts';
import SignUpPage from '../../pages/auth/sign_up';
import SignInPage from '../../pages/auth/sign_in';

const Paths: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/iframe.html" element={<Index />} />
      <Route path="/posts/:postId" element={<_Post />} />
      <Route path="/auth/sign_up" element={<SignUpPage />} />
      <Route path="/auth/sign_in" element={<SignInPage />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Paths;

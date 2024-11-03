import React from "react";
import { Routes, Route } from "react-router-dom";
import SoftwareBlog from "../../pages";
import About from "../../pages/about";
import Contact from "../../pages/contact";



const Paths: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<SoftwareBlog />} />
      <Route path="/blog/:postId" element={<SoftwareBlog />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
};

export default Paths;
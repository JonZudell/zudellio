import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import SoftwareBlog from './pages/SoftwareBlog';

const App: React.FC = () => {
  return (
    <>
    <Header />
      <Routes>
        <Route path="/" element={<SoftwareBlog />} />
      </Routes>
    <Footer />
    </>
  );
};

export default App;
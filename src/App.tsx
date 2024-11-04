import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Content from './components/Content';
import Footer from './components/Footer';
import Header from './components/Header';
import { useTheme } from './contexts/ThemeContext';
import About from './pages/About';
import Contact from './pages/Contact';
import SoftwareBlog from './pages/SoftwareBlog';

interface AppProps {
  theme: 'light' | 'dark';
}

const App: React.FC<AppProps> = ({ theme }) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return (
    <>
      <Header />
        <Content>
          <Routes>
            <Route path="/" element={<SoftwareBlog />} />
            <Route path="/:page_number" element={<SoftwareBlog />} />
            <Route path="/blog/:postId" element={<SoftwareBlog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Content>
      <Footer />
    </>
  );
};

export default App;
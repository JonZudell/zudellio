// src/App.tsx
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css'; // Ensure Tailwind CSS is imported
import SignUp from './pages/SignUp';
interface AppProps {
  initialData?: any;
  location?: string;
  context?: any;
}

const App: React.FC<AppProps> = ({ initialData, location }) => {
  const Router = location ? StaticRouter : BrowserRouter;
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router location={location || '/'}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  )
};

export default App;
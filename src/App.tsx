import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NoContext from './components/NoContext';
import './index.css';

const App: React.FC = () => {
  return (
    <Router>
      <NoContext />
    </Router>
  );
};

export default App;
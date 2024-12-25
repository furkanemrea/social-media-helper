import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import InstagramAccountFinder from './components/InstagramAccountFinder';
import './App.css';
import 'antd/dist/reset.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/finder" element={<InstagramAccountFinder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import FileUpload from './FileUpload';
import MyFiles from './MyFiles';
import SharedWithYou from './SharedWithYou';
import Register from './Register';
import Home from './Home';
import Login from './Login';
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  }

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/my-files" element={<MyFiles />} />
            <Route path="/shared-with-you" element={<SharedWithYou />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;


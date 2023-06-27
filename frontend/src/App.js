import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import FileUpload from './FileUpload';
import FileDownload from './FileDownload';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <Link to="/">Upload</Link>
              </li>
              <li>
                <Link to="/download">Download</Link>
              </li>
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<FileUpload />} />
            <Route path="/download" element={<FileDownload />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;


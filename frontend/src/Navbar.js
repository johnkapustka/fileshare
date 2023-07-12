import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'
import './App.css'

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/upload">Upload</Link></li>
        <li><Link to="/my-files">My Files</Link></li>
        <li><Link to="/shared-with-you">Shared With You</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;


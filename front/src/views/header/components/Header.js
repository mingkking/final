// src/components/Header.js
import React from 'react';
import Navbar from './Navber';

const Header = () => {
  return (
    <header>
      <div className="nav-area">
        <a href="/" className="logo">
        logo
        </a>
          <Navbar/>
      </div>
      
    </header>
  );
};

export default Header;

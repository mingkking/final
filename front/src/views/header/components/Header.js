// src/components/Header.js
import React from 'react';
import Navbar from './Navber';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="nav-area">
        <Link to={"/"} className="logo">
          Logo
        </Link>
          <Navbar/>
      </div>
      
    </header>
  );
};

export default Header;

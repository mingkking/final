// src/components/Header.js
import React from 'react';
import Navbar from './Navber';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="nav-area">
        <Link to={"/"} className="logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="60" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#007bff" />
                <stop offset="100%" stopColor="#6610f2" />
              </linearGradient>
            </defs>
            <g transform="translate(0, 10) scale(0.8)">
              <path d="M50,60 L70,80" stroke="url(#grad1)" strokeWidth="10" strokeLinecap="round"/>
              <circle cx="35" cy="35" r="30" fill="none" stroke="url(#grad1)" strokeWidth="8"/>
              <polyline points="15,45 25,30 35,40 50,25" fill="none" stroke="#333" strokeWidth="3"/>
            </g>
          </svg>
        </Link>
          <Navbar/>
      </div>
      
    </header>
  );
};

export default Header;

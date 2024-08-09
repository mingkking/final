import React from 'react';
import Navbar from './Navber';
import { Link } from 'react-router-dom';
import '../headerCss/Header.css';

const Header = () => {
  return (
    <header>
      <div className="nav-area">
        <Link to={"/"} className="logo">
          <svg xmlns="http://www.w3.org/2000/svg" width="250" height="80" viewBox="0 0 250 80">
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4CAF50" />
                <stop offset="100%" stopColor="#2196F3" />
              </linearGradient>
            </defs>
            <g transform="translate(0, 10)">
              <circle cx="30" cy="30" r="24" fill="none" stroke="url(#logoGradient)" strokeWidth="6"/>
              <path d="M46,44 L62,60" stroke="url(#logoGradient)" strokeWidth="6" strokeLinecap="round"/>
              <polyline points="14,34 22,22 30,30 42,18" fill="none" stroke="#333" strokeWidth="2.5"/>
            </g>
            <text x="100" y="50" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
              <tspan fill="#333">Invest</tspan>
              <tspan fill="url(#logoGradient)" dx="8">Gate</tspan>
            </text>
          </svg>
        </Link>
        <Navbar />
      </div>
    </header>
  );
};

export default Header;

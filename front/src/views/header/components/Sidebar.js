import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItemsData } from '../menuItemsData'; // 올바른 경로에서 임포트
import '../headerCss/Sidebar.css'; // 사이드바 CSS 파일 임포트

const Sidebar = ({ isOpen, onClose }) => {
  const handleMenuClick = () => {
    onClose(); // 사이드바를 닫는 함수 호출
  };

  return (
    <div className={`app-sidebar ${isOpen ? 'open' : ''}`}>
      <ul className="app-sidebar-menu">
        <div className="app-side-nav-area">
          <Link to={"/"} className="app-logo">
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
              <text x="100" y="50" font-family="Arial, sans-serif" font-size="18" font-weight="bold">
                <tspan fill="#fff">Invest</tspan>
                <tspan fill="url(#logoGradient)" dx="8">Gate</tspan>
              </text>
            </svg>
          </Link>
        </div>
        {MenuItemsData.map((menu, index) => (
          <li key={index}>
            <Link to={`/${menu.url}`} onClick={handleMenuClick}>
              {menu.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MenuItemsData } from '../menuItemsData'; // 올바른 경로에서 임포트
import '../headerCss/Sidebar.css'; // 사이드바 CSS 파일 임포트

const Sidebar = ({ isOpen, onClose }) => {
  const handleMenuClick = () => {
    onClose(); // 사이드바를 닫는 함수 호출
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose}>닫기</button>
      <ul className="sidebar-menu">
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

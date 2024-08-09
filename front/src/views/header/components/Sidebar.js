// Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuItemsData } from '../menuItemsData'; // 올바른 경로에서 임포트
import '../headerCss/Sidebar.css'; // 사이드바 CSS 파일 임포트
import { useContext, useEffect } from 'react';

import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon, 
  ListItemText
} from '@mui/material';

import { IconEdit, IconLeaf, IconListCheck, IconUser } from '@tabler/icons-react';

import LoginContext from '../../login/contexts/LoginContext';
import axiosInstance from '../../login/component/Token/axiosInstance';

const Sidebar = ({ isOpen, onClose, isLoggedIn, userNickname, onLogout }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { state, actions } = useContext(LoginContext);
  const [anchorEl2, setAnchorEl2] = useState(null);

  useEffect(() => { 
    
    // 로그인 상태를 확인할 때 프로필 사진 URL을 가져옵니다.
    if (state.userId && !state.profileImage) {
      axiosInstance.get(`/profile-image/${state.userId}`)
        .then(response => {
          console.log('Profile image response:', response.data);
          const data = response.data;
          if (data.profileImageUrl) {
            const profileImageUrl = `http://localhost:8080${data.profileImageUrl}`;
            actions.setProfileImage(profileImageUrl);
          }
        })
        .catch(error => console.error('Error fetching profile image:', error));
    }
    
  }, [state.userId, state.profileImage, actions]);

  const handleMenuClick = () => {
    onClose(); // 사이드바를 닫는 함수 호출
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen); // 프로필 메뉴 상태 토글
  };
  
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
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
        {isLoggedIn ? (
          <>
            <li className="user-info" onClick={toggleProfileMenu}>
            <IconButton
              size="large"
              aria-label="show 11 new notifications"
              color="inherit"
              aria-controls="msgs-menu"
              aria-haspopup="true"
              sx={{
                ...(typeof anchorEl2 === 'object' && {
                  color: 'primary.main',
                }),
              }}
              onClick={handleClick2}
            >
              <Avatar
                src={state.profileImage} 
                alt="Profile"
                sx={{
                  width: 35,
                  height: 35,            
                }}
                
                
              />
            </IconButton>
              <span>{userNickname}</span>
              {isProfileMenuOpen && (
                <ul className="profile-menu">
                  <li>
                    <Link to="/MyPage" onClick={handleMenuClick}>
                      마이페이지
                    </Link>
                  </li>
                  <li>
                    <Link to="/PwFind" onClick={handleMenuClick}>
                      비밀번호변경
                    </Link>
                  </li>
                  <li>
                    <Link to="/DeleteMember" onClick={handleMenuClick}>
                      회원탈퇴
                    </Link>
                  </li>
                  <li>
                    <button onClick={onLogout} className="logout-button">
                      로그아웃
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <li>
            <Link to="/login" onClick={handleMenuClick}>
              로그인
            </Link>
          </li>
        )}
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

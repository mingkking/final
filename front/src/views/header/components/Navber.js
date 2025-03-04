// Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItems from './MenuItems';
import { MenuItemsData } from '../menuItemsData'; // 올바른 경로에서 임포트
import axiosInstance from '../../login/component/Token/axiosInstance';
import LoginContext from '../../login/contexts/LoginContext';
import Profile from './Profile';
import Sidebar from './Sidebar'; // 사이드바 컴포넌트 임포트
import '../headerCss/Navbar.css'; // CSS 파일 임포트

const Navbar = ({ onLoginSuccess }) => {
  const depthLevel = 0;
  const navigate = useNavigate();
  const { state, actions } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  const [profileImage, setProfileImage] = useState(''); // 프로필 이미지 상태 추가
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 열림 상태 추가

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axiosInstance.get('/check-login-status', {
          withCredentials: true,
        });

        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserNickname(response.data.userNickname); // 사용자 닉네임 업데이트
          setProfileImage(response.data.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'); // 프로필 이미지 업데이트
          actions.setAfterLoginNick(response.data.userNickname);
        } else {
          setIsLoggedIn(false);
          setUserNickname('');
          setProfileImage('');
          actions.setAfterLoginNick('');
        }
      } catch (error) {
        console.error('Error checking login status:', error.response?.data || error.message);
        setIsLoggedIn(false);
        setUserNickname('');
        setProfileImage('');
        actions.setAfterLoginNick('');
      }
    };

    checkLoginStatus();

    const handleLoginEvent = (event) => {
      setUserNickname(event.detail);
      setIsLoggedIn(true);
    };

    document.addEventListener('loginSuccess', handleLoginEvent);

    return () => {
      document.removeEventListener('loginSuccess', handleLoginEvent);
    };
  }, [actions]);

  const handleLogoutClick = async () => {
    try {
      await axiosInstance.post('/logout', {}, {
        withCredentials: true,
      });

      setIsLoggedIn(false);
      setUserNickname('');
      setProfileImage('');
      actions.setAfterLoginNick('');
      actions.setProfileImage('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');

      // 로컬 스토리지의 favoriteProperties 키 초기화 (빈 배열로 설정)
      localStorage.setItem('favoriteProperties', JSON.stringify([]));

      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error.response?.data || error.message);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="desktop-nav">
        <div className="menu-toggle" onClick={toggleSidebar}>
            <span>&#9776;</span> {/* 햄버거 아이콘 */}
        </div>
        <ul className="menus">
            {MenuItemsData.map((menu, index) => (
                <MenuItems items={menu} key={index} depthLevel={depthLevel} />
            ))}
        </ul>
        <div className="auth-buttons">
            {isLoggedIn ? (
                <div className="user-menu">
                    <div>{state.afterLoginNick}</div>
                    <Profile onLogout={handleLogoutClick} />
                </div>
            ) : (
                <button type="button" className="btn" style={{ color: '#fff'}} onClick={handleLoginClick}>로그인</button>
            )}
        </div>
      </nav>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isLoggedIn={isLoggedIn}
        userNickname={userNickname}
        profileImage={profileImage}
        onLogout={handleLogoutClick}
      /> {/* 사이드바 추가 */}
    </>
  );
};

export default Navbar;

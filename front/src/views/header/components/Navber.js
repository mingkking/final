import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItems from './MenuItems';
import { MenuItemsData } from '../menuItemsData';
import axiosInstance from '../../login/component/Token/axiosInstance';
import { useContext, useState, useEffect } from 'react';
import LoginContext from '../../login/contexts/LoginContext';
import "../../login/Login.css";
import Profile from './Profile';
import { Avatar } from '@mui/material';

const Navbar = ({ onLoginSuccess }) => {
  const depthLevel = 0;
  const navigate = useNavigate(); // Hook for navigation
  
  const { state, actions } = useContext(LoginContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');
  
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axiosInstance.get('/check-login-status', {
          withCredentials: true, // 쿠키를 포함하여 요청을 보냅니다.
        });
    
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          actions.setAfterLoginNick(response.data.userNickname);
          if (onLoginSuccess) {
            onLoginSuccess(response.data.userNickname);
          }
        } else {
          setIsLoggedIn(false);
          actions.setAfterLoginNick('');
        }
      } catch (error) {
        console.error('Error checking login status:', error.response?.data || error.message);
        setIsLoggedIn(false);
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
      actions.setAfterLoginNick('');
      actions.setProfileImage('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');

      if (onLoginSuccess) {
        onLoginSuccess('');
      }
  
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error.response?.data || error.message);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="desktop-nav">
      <ul className="menus">
        { MenuItemsData.map((menu, index) => (
          <MenuItems items={menu} key={index} depthLevel={depthLevel} />
        ))}
      </ul>
      <form className="d-flex search-form" style={{ marginRight: '50px' }}>
        <input className="form-control me-sm-2" type="search" placeholder="Search"/>
        <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
      </form>
      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="user-menu">
            <div>{state.afterLoginNick}</div>
            <Profile onLogout={handleLogoutClick} />
          </div>
        ) : (
          <button type="button" className="btn btn-light" onClick={handleLoginClick}>로그인</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

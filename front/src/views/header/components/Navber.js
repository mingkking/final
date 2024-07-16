
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItems from './MenuItems';
import { MenuItemsData } from '../menuItemsData';
import axiosInstance from '../../login/component/Token/axiosInstance';
import { useState, useEffect } from 'react';




const Navbar = ({ onLoginSuccess }) => {


  const depthLevel = 0;
  const navigate = useNavigate(); // Hook for navigation

  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userNickname, setUserNickname] = useState('');

  

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsLoggedIn(false);
          setUserNickname('');
          return;
        }

        const response = await axiosInstance.get('/check-login-status', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserNickname(response.data.userNickname);

          if (onLoginSuccess) {
            onLoginSuccess(response.data.userNickname); // Ensure this prop is working as expected
          }
        } else {
          setIsLoggedIn(false);
          setUserNickname('');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
        setUserNickname('');
      }
    };

    checkLoginStatus();
    const handleLoginEvent = (event) => {
      console.log('Login event received with nickname:', event.detail); // Add this line
      setUserNickname(event.detail);
      setIsLoggedIn(true);
    };
    document.addEventListener('loginSuccess', handleLoginEvent);

    return () => {
      document.removeEventListener('loginSuccess', handleLoginEvent);
    };
  }, [onLoginSuccess]);

  const handleLogoutClick = async () => {
    try {
      await axiosInstance.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUserNickname('');

      if (onLoginSuccess) {
        onLoginSuccess('');
      }

      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (

    <nav className="desktop-nav ">
      <ul className="menus">
        { MenuItemsData.map((menu, index) => (
          <MenuItems items={menu} key={index} depthLevel={depthLevel} />
        ))}
        
      </ul>
        <form className="d-flex search-form">
          <input className="form-control me-sm-2" type="search" placeholder="Search"/>
          <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
        </form>
        <div className="auth-buttons">
                {isLoggedIn ? (
                    <div>
                        <span> {userNickname} / </span>
                        <button type="button" className="btn btn-light" onClick={handleLogoutClick}>로그아웃</button>
                    </div>
                ) : (
                    <button type="button" className="btn btn-light"  onClick={handleLoginClick}>로그인</button>
                )}
            </div>
    </nav>
    
  );
};

export default Navbar;


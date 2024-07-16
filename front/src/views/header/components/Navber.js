
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

  

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to /login
  };

  // 로그인 상태 확인
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
                  Authorization: `Bearer ${token}`,
              },
          });


          if (response.data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setUserNickname(response.data.userNickname);

                    // `onLoginSuccess` 호출하여 상태 업데이트
                    if (onLoginSuccess) {
                      onLoginSuccess(response.data.userNickname);
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
  }, [onLoginSuccess]);

  

   // 로그아웃 함수
   const handleLogoutClick = async () => {
    try {
        await axiosInstance.post('/api/logout', {}, { // 요청 시 빈 객체를 포함
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
    } catch (error) {
        console.error('Error during logout:', error);
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false); // 상태 업데이트
    setUserNickname('');
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
                        <button type="button" className="btn btn-light" onClick={handleLogoutClick}>로그아</button>
                    </div>
                ) : (
                    <button type="button" className="btn btn-light"  onClick={handleLoginClick}>로그인</button>
                )}
            </div>
    </nav>
    
  );
};

export default Navbar;


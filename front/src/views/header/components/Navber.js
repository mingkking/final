
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
    // 로그인 상태를 확인하는 비동기 함수
    const checkLoginStatus = async () => {
      try {
        const response = await axiosInstance.get('/check-login-status', {
          withCredentials: true, // 쿠키를 포함하여 요청을 보냅니다.
        });
    
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);
          setUserNickname(response.data.userNickname);
    
          if (onLoginSuccess) {
            onLoginSuccess(response.data.userNickname);
          }
        } else {
          setIsLoggedIn(false);
          setUserNickname('');
        }
      } catch (error) {
        console.error('Error checking login status:', error.response?.data || error.message);
        setIsLoggedIn(false);
        setUserNickname('');
      }
    };

    checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태를 확인

    // 로그인 성공 이벤트를 처리하는 핸들러 함수
    const handleLoginEvent = (event) => {
      setUserNickname(event.detail); // 이벤트에서 받은 닉네임을 상태에 설정
      setIsLoggedIn(true); // 로그인 상태를 true로 설정
    };

    // `loginSuccess` 이벤트를 리스닝
    document.addEventListener('loginSuccess', handleLoginEvent);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => {
      document.removeEventListener('loginSuccess', handleLoginEvent);
    };
  }, [onLoginSuccess]);

  // 로그아웃 버튼 클릭 시 실행되는 함수
  const handleLogoutClick = async () => {
    try {
      await axiosInstance.post('/logout', {}, {
        withCredentials: true, // 쿠키를 포함하여 요청을 보냅니다.
      });
  
      
  
      // 로그인 상태를 초기화합니다.
      setIsLoggedIn(false);
      setUserNickname('');
  
      // `onLoginSuccess` 콜백이 prop으로 전달되었으면 빈 문자열을 전달하여 로그인 상태를 초기화합니다.
      if (onLoginSuccess) {
        onLoginSuccess('');
      }
  
      // 홈 페이지로 네비게이트합니다.
      navigate('/');
    } catch (error) {
      // 로그아웃 중 에러가 발생하면 에러를 로그에 출력합니다.
      console.error('Error during logout:', error.response?.data || error.message);
    }
  };

  // 로그인 버튼 클릭 시 실행되는 함수
  const handleLoginClick = () => {
    // 로그인 페이지로 네비게이트
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


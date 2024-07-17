
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
        
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsLoggedIn(false);
          setUserNickname('');
          return;
        }

        // 서버에 로그인 상태를 확인하는 요청을 보냄
        const response = await axiosInstance.get('/check-login-status', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Authorization 헤더에 토큰을 포함
          },
        });
        
       

        if (response.data.isLoggedIn) {
          // 로그인 상태가 true이면 상태를 업데이트하고 닉네임을 설정
          setIsLoggedIn(true);
          setUserNickname(response.data.userNickname);

          // `onLoginSuccess` 콜백이 prop으로 전달되었으면 호출
          if (onLoginSuccess) {
            onLoginSuccess(response.data.userNickname); // 로그인 성공 시 닉네임을 부모 컴포넌트로 전달
          }
        } else {
          // 로그인 상태가 false이면 상태를 초기화
          setIsLoggedIn(false);
          setUserNickname('');
        }
      } catch (error) {
        // 로그인 상태 확인 중 에러가 발생하면 상태를 초기화
        console.error('Error checking login status:', error);
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
  }, []);

  // 로그아웃 버튼 클릭 시 실행되는 함수
  const handleLogoutClick = async () => {
    try {
      await axiosInstance.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // 로그아웃 요청 시 현재 토큰을 포함
        },
      });

      
      
      // 로컬스토리지에서 토큰을 제거하고 상태를 초기화
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsLoggedIn(false);
      setUserNickname('');

      // `onLoginSuccess` 콜백이 prop으로 전달되었으면 빈 문자열을 전달하여 로그인 상태를 초기화
      if (onLoginSuccess) {
        onLoginSuccess('');
      }

      // 홈 페이지로 네비게이트
      navigate('/');
    } catch (error) {
      // 로그아웃 중 에러가 발생하면 에러를 로그에 출력
      console.error('Error during logout:', error);
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


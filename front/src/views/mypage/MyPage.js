import React from 'react';
import './MyPage.css';
import { useContext, useRef, useState, useEffect } from 'react';
import LoginContext from '../login/contexts/LoginContext';
import { Avatar } from '@mui/material';
import UploadImage from './component/UploadImage';
import axiosInstance from '../login/component/Token/axiosInstance';
import imges from '../../imges/123.jpeg';
import "./component/UploadImage.css";

const MyPage = () => {

  const { state, actions } = useContext(LoginContext);
  const [profileImage, setProfileImage] = useState('');

  const BASE_URL = 'http://localhost:8080';
  

  useEffect(() => {
    if (state.userId) {
        axiosInstance.get(`/profile-image/${state.userId}`)
            .then(response => {
                const imageUrl = response.data.profileImageUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`;
                setProfileImage(fullImageUrl);
                actions.setProfileImage(fullImageUrl); // 상태 업데이트
            })
            .catch(error => console.error('Error fetching profile image:', error));
    }
}, [state.userId, actions]);

  const handleImageUpload = (newProfileImageUrl) => {
    console.log('Uploaded profile image URL:', newProfileImageUrl);
    setProfileImage(`${BASE_URL}${newProfileImageUrl}`);
    actions.setProfileImage(`${BASE_URL}${newProfileImageUrl}`); // 상태 업데이트
  };


      

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <br/><br/>
      <div className="profile-section">
        <div className="profile-info">
          <div className="profile-avatar-container">

          <Avatar
          src={profileImage || state.profileImage}
          alt="Profile"
          sx={{width:100, height:100,}}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
          }}
        />
         <UploadImage onImageUpload={handleImageUpload} />
          
          </div>
          

          <div className="profile-details">
            <h2 className="nickname">{state.afterLoginNick}</h2>
            <table className="profile-stats">
              <thead>
                <tr>
                  <th>댓글</th>
                  <th>게시글</th>
                  <th>팔로워</th>
                  <th>팔로잉</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>

            
            
          </div>
        </div>
        <button className="edit-profile-button">프로필 수정</button>
        

        
        <div className="my-posts">
          <h3>내가 쓴 글</h3>
          <div className="post">
            <div className="post-header">
            <Avatar
              src={profileImage || state.profileImage}
              alt="Profile"
              sx={{width:60, height:60,}}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
              }}
            />
              <div>
                <h3 className="post-nickname">{state.afterLoginNick}</h3>
                <span className="post-date">2024.07.03</span>
              </div>
            </div>
            
            
            
            <div className="post-content">

            <h3>오늘도 화이팅</h3>
              <div className="post-image-placeholder">
                <img src={imges} />
              </div>
            </div>

            <div className="mypage-item">
              <div className='mypage-item-likeBtn'>
                {false ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className="bi bi-heart">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bi bi-heart">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                )}
              </div>
              <div className='mypage-item-replyBtn'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bi bi-chat">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z" />
                </svg>
              </div>
              <div className='mypage-item-share'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bi bi-share">
                  <path d="M18 16.08C17.24 16.08 16.56 16.38 16.05 16.88L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.36C15.11 18.58 15.08 18.79 15.08 19C15.08 20.66 16.42 22 18.08 22C19.74 22 21.08 20.66 21.08 19C21.08 17.34 19.74 16 18.08 16H18V16.08Z" />
                </svg>
              </div>
              <div className='mypage-item-bookmark'>
                {false ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
                    <path d="M19 3H5a2 2 0 0 0-2 2v18l7-5 7 5V5a2 2 0 0 0-2-2z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                )}
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
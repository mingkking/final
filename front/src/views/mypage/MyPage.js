import React from 'react';
import './MyPage.css';
import { useContext, useRef, useState, useEffect } from 'react';
import LoginContext from '../login/contexts/LoginContext';
import { Avatar } from '@mui/material';
import UploadImage from './component/UploadImage';
import axiosInstance from '../login/component/Token/axiosInstance';

const MyPage = () => {

  const { state, actions } = useContext(LoginContext);
  const [profileImage, setProfileImage] = useState('');
  
  
  useEffect(() => {
    console.log('Current userId in MyPage:', state.userId);
    if (!state.userId) {
      console.error('User ID is not available');
      return;
    }

    const fetchProfileImage = async () => {
      try {
        const response = await axiosInstance.get(`/profile-image/${state.userId}`);
        setProfileImage(response.data.profileImageUrl || '');
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [state.userId]);

  const handleImageUpload = (newProfileImageUrl) => {
    setProfileImage(newProfileImageUrl);
    actions.setProfileImage(newProfileImageUrl); // 상태 업데이트
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
          sx={{width:100, height:100,objectFit: 'cover'}}
          
          
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
              <span className="post-nickname">{state.afterLoginNick}</span>
              <span className="post-date">2024.07.03</span>
            </div>
            <div className="post-content">
              <div className="post-image-placeholder">
              </div>
              <p>오늘도 화이팅</p>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
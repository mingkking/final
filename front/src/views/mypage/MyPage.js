import React from 'react';
import './MyPage.css';
import { useContext, useRef, useState, useEffect } from 'react';
import LoginContext from '../login/contexts/LoginContext';
import { Avatar } from '@mui/material';

const MyPage = () => {

  const { state, actions } = useContext(LoginContext);
  const [Image, setImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png")
  const fileInput = useRef(null);
  
  useEffect(() => {
    fetch(`/api/profile-image/${state.userId}`)
        .then(response => response.json())
        .then(data => {
            if (data.profileImageUrl) {
              setImage(data.profileImageUrl); // 상태 업데이트
                actions.setProfileImage(data.profileImageUrl); // 상태 업데이트
            }
        })
        .catch(error => console.error('Error fetching profile image:', error));
}, [state.userId]);

  const onChange = (e) => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                fetch('/api/update-profile-image', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: state.userId, // 상태에서 사용자 ID 가져오기
                        profileImageUrl: reader.result
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Profile image updated successfully', data);
                    setImage(reader.result); // 상태 업데이트
                    actions.setProfileImage(reader.result); // 상태 업데이트
                })
                .catch(error => console.error('Error updating profile image:', error));
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }
};

      const handleProfileImageEditClick = () => {
        fileInput.current.click();
      };

      

  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <br/><br/>
      <div className="profile-section">
        <div className="profile-info">
          <div className="profile-avatar-container">

          <Avatar
          src={state.profileImage}
          alt="Profile"
          sx={{width:100, height:100}}
          className="profile-avatar"
          
        />
          <button className="edit-profile-image-button" onClick={handleProfileImageEditClick}>
              편집
          </button>
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
        <input 
 	        type='file' 
    	    style={{display:'none'}}
          accept='image/jpg,impge/png,image/jpeg' 
          name='profile_img'
          onChange={onChange}
          ref={fileInput}/> 

        
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
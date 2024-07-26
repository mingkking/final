import React from 'react';
import './MyPage.css';

const MyPage = () => {
  return (
    <div className="mypage-container">
      <h1 className="mypage-title">마이페이지</h1>
      <div className="profile-section">
        <div className="profile-info">
          <div className="profile-picture">
            <img src="path_to_profile_image" alt="프로필 이미지" />
          </div>
          <div className="profile-details">
            <h2 className="nickname">닉네임</h2>
            <div className="profile-stats">
              <span>댓글 0</span>
              <span>게시글 0</span>
              <span>팔로워 0</span>
              <span>팔로잉 0</span>
            </div>
            <button className="edit-profile-button">프로필 수정</button>
          </div>
        </div>
        <div className="my-posts">
          <h3>내가 쓴 글</h3>
          <div className="post">
            <div className="post-header">
              <span className="post-nickname">닉네임</span>
              <span className="post-date">2024.07.03</span>
            </div>
            <div className="post-content">
              <p>오늘도 화이팅</p>
              <div className="post-image-placeholder"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
import React from 'react';
import './MemberPage.css';
import { useContext, useRef, useState, useEffect } from 'react';
import LoginContext from '../login/contexts/LoginContext';
import { Avatar } from '@mui/material';
import axiosInstance from '../login/component/Token/axiosInstance';
import "./component/UploadImage.css";
import {  Link, useParams, useLocation } from 'react-router-dom';
import UserLike from '../community/components/UserLike/UserLike';
import ReplyBtn from '../community/components/ReplyBtn/ReplyBtn';
import Share from '../community/components/Share/Share';
import Bookmark from '../community/components/Bookmark/Bookmark';
import CommunityContext from '../community/contexts/CommunityContext';



const MemberPage = () => {

  const { state, actions } = useContext(LoginContext);
  const [profileImage, setProfileImage] = useState('');
  const { id } = useParams();
  const location = useLocation();
  const userId = location.state?.id || id;
  
    const communityContext = useContext(CommunityContext);
  
  
 
  const createAtCal = (created_at) => {
    const now = new Date();
    const date = new Date(created_at);

    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) {
      return `${diffInSeconds}초 전`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
      return `${diffInWeeks}개월 전`;
    }

  }

  // 현재 사용자 ID에 해당하는 게시글만 필터링
  const [myPosts, setMyPosts] = useState([]);
  const [nickname, setNickname] = useState('');
  const { state: communityState, actions: communityActions } = useContext(CommunityContext);
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get(`/profile-image/${userId}`);
        const userData = response.data;
        const absoluteProfileImageUrl = userData.profileImageUrl.startsWith('/images/') ? `http://localhost:8080${userData.profileImageUrl}` : userData.profileImageUrl;
        setProfileImage(absoluteProfileImageUrl);
        setNickname(userData.userNickname || '닉네임 없음');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  
  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await fetch('http://localhost:8080/selectCommunity');
        const data = await response.json();
        communityContext.actions.setSelectAllPosts(data);
      } catch (error) {
        console.error('Error fetching community data:', error);
      }
    };
    fetchCommunityData();
  }, []);




  useEffect(() => {
    const fetchMyPosts = async () => {
      if (userId) {
        const userPosts = communityContext.state.selectAllPosts.filter(post => post.user_num.userId === userId);
        setMyPosts(userPosts);
      }
    };
    fetchMyPosts();
  }, [userId, communityContext.state.selectAllPosts]);

//---------------------------------------------------------

return (
    <div className="mypage-container">
      <div className="profile-section">
        <div className="profile-info">
          <div className="profile-avatar-container">
            <Avatar
              src={profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
              alt="Profile"
              sx={{ width: 100, height: 100 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
              }}
            />
          </div>
          <div className="profile-details">
            <h2 className="memberpage-nickname">{nickname}</h2>
            <table className="profile-stats">
              <thead>
                <tr>
                  <th>댓글</th>
                  <th>게시글</th>
                  
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0</td>
                  <td>{myPosts.length}</td>
                  
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <hr className='member-hr'/>
        <div className="my-posts">
          <h3>작성한 글</h3>
          <ul className="post-list">
            {myPosts.length > 0 ? (
              myPosts.map(post => (
                <li key={post.id} className="post-item">
                  <div className="post-item-top">
                    <div className='post-item-profile'>
                      <Avatar
                        src={profileImage || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt="Profile"
                        sx={{ width: 35, height: 35 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                        }}
                      />
                    </div>
                    <div className='post-item-info'>
                      <div className='post-item-userNickname'>{post.user_num.userNickname}</div>
                      <div className='post-item-created_at'>{createAtCal(post.created_at)}</div>
                    </div>
                  </div>

                  <div className="post-item-middle">
                    <div className='post-item-title'>
                      <Link className="no-underline-link" to={"/DetailCommunity"} state={{ id: post.id }}>
                        {post.title}<br />
                      </Link>
                    </div>

                    <div className='post-item-contents'>
                      <Link className="no-underline-link" to={"/DetailCommunity"} state={{ id: post.id }}>
                        {post.contents}<br />
                      </Link>
                    </div>
                  </div>

                  <div className="post-item-bottom">
                    <div className='post-item-uploadFile'>
                      {post.image_path && (<img src={`http://localhost:8080/images/${post.image_path}`} alt={"업로드 이미지"}></img>)}
                    </div>
                  </div>

                  <div className="post-item-actions">
                    <UserLike postId={post.id} />
                    <ReplyBtn postId={post.id} />
                    <Share post={post}/>
                    <Bookmark postId={post.id} />
                  </div>
                </li>
              ))
            ) : (
              <p>작성한 게시글이 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberPage;
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './Posts.css';
import { useNavigate, Link } from 'react-router-dom';
import CommunityContext from '../../contexts/CommunityContext';
import UserLike from '../UserLike/UserLike';
import Reply from '../Reply/Reply';
import Share from '../Share/Share';
import Bookmark from '../Bookmark/Bookmark';

function Posts() {
  const navigate = useNavigate();
  const postsValue = useContext(CommunityContext);
  
  const [keyword, setKeyword] = useState('');

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

  const handleSearch = (event) => {
    // setKeyword(event.target.value);
    // axios.get(`/api/posts/search?keyword=${event.target.value}`)
    //   .then(response => setPosts(response.data))
    //   .catch(error => console.error(error));
  };

  const insertCommunity = (evt) => {
    evt.preventDefault();
    navigate("/InsertCommunity");
  }

  return (
    <div className="container">
      <div className='community-navbar'>
        <h2 className="community-header">커뮤니티</h2>
        <input
          type="text"
          placeholder="검색어를 입력하세요..."
          value={keyword}
          onChange={handleSearch}
          className="community-search-bar"
        />
        <button onClick={insertCommunity} className='community-insertBtn'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M15.9 5.1a2 2 0 0 1 2.8 2.8L8.2 19.6a2 2 0 0 1-1.2.4H3v-4.2a2 2 0 0 1 .4-1.2L15.9 5.1z" />
            <path d="M18.6 7.4l-1.4-1.4" />
          </svg>
        </button>
      </div>
      <ul className="post-list">
        {postsValue.state.selectAllPosts.map(post => (
          <li key={post.id} className="post-item">
            <div className="post-item-top">
              <div className='post-item-profile'><img src="profile.jpeg" className="profile-image"></img></div>
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
                사진 업로드 파일<br />
              </div>
            </div>

            <div className="post-item-actions">
              <UserLike postId={post.id}/>
              <Reply/>
              <Share/>
              <Bookmark/>
            </div>
          </li>
        ))}
      </ul>
    </div >
  );
}

export default Posts;
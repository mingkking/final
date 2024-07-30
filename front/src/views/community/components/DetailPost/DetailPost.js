import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './DetailPost.css';
import { useNavigate, Link } from 'react-router-dom';
import CommunityContext from '../../contexts/CommunityContext';
import axiosInstance from '../../../login/component/Token/axiosInstance';

function DetailPost() {
  const navigate = useNavigate();
  const detailPostValue = useContext(CommunityContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  const toggleDropdown = () => {
    console.log(isDropdownOpen);
    setIsDropdownOpen(!isDropdownOpen);
  };

  console.log(detailPostValue.state.selectOnePost);
  if (!detailPostValue.state.selectOnePost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">

      <div className='detailCommunity-navbar'>

        <button className='detailPost-item-replyBtn'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-menu">
            <path d="M13 17l-5-5 5-5" fill='none' />
            <path d="M18 17l-5-5 5-5" fill='none' />
          </svg>
        </button>

        <div className='detailPost-item-title'>
          {detailPostValue.state.selectOnePost.title}<br />
        </div>

        <div className='dropdown'>
          <button className='detailCommunity-menuBtn' onClick={toggleDropdown}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-menu">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item"><button>1</button></div>
              <div className="dropdown-item"><button>2</button></div>
            </div>
          )}
        </div>

      </div>

      <ul className="detailPost-list">

        <li className="detailPost-item">

          <div className="detailPost-item-top">
            <div className='detailPost-item-profile'><img src="profile.jpeg" className="profile-image"></img></div>
            <div className='detailPost-item-info'>
              <div className='detailPost-item-userNickname'>{detailPostValue.state.selectOnePost.user_num.userNickname}</div>
              <div className='detailPost-item-created_at'>{createAtCal(detailPostValue.state.selectOnePost.created_at)}</div>
            </div>
          </div>

          <div className="detailPost-item-middle">

            <div className='detailPost-item-title'>
              {detailPostValue.state.selectOnePost.id}<br />
              {detailPostValue.state.selectOnePost.title}<br />
            </div>

            <div className='detailPost-item-contents'>
              {detailPostValue.state.selectOnePost.contents}<br />
            </div>

          </div>

          <div className="detailPost-item-bottom">
            <div className='detailPost-item-uploadFile'>
              사진 업로드 파일<br />
            </div>
          </div>

          <div className="detailPost-item-actions">
            <div className='detailPost-item-likeBtn'>
              {false ?
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-heart"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                :
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="bi bi-heart"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              }
            </div>
            <div className='detailPost-item-replyBtn'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bi bi-chat"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z" />
              </svg>
            </div>
            <div className='detailPost-item-share'>
              <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bi bi-chat">
                <path d="M18 16.08C17.24 16.08 16.56 16.38 16.05 16.88L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.36C15.11 18.58 15.08 18.79 15.08 19C15.08 20.66 16.42 22 18.08 22C19.74 22 21.08 20.66 21.08 19C21.08 17.34 19.74 16 18.08 16H18V16.08Z" />
              </svg>

            </div>
            <div className='detailPost-item-bookmark'>
              {false ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
                  <path d="M19 3H5a2 2 0 0 0-2 2v18l7-5 7 5V5a2 2 0 0 0-2-2z" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bookmark">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              }
            </div>
          </div>
        </li>
      </ul>
    </div >
  );
}

export default DetailPost;
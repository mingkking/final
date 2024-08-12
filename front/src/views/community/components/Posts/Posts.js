import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './Posts.css';
import { useNavigate, Link } from 'react-router-dom';
import CommunityContext from '../../contexts/CommunityContext';
import UserLike from '../UserLike/UserLike';
import Reply from '../ReplyBtn/ReplyBtn';
import Share from '../Share/Share';
import Bookmark from '../Bookmark/Bookmark';
import LoginContext from '../../../login/contexts/LoginContext';
import ReplyBtn from '../ReplyBtn/ReplyBtn';
import { Tooltip } from '@mui/material';

function Posts() {
  const navigate = useNavigate();
  const postsValue = useContext(CommunityContext);
  const loginValue = useContext(LoginContext);
  const allPostList = postsValue.state.selectAllPosts || [];

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

  const selectAllPosts = async () => {                                    // 커뮤니티 모든 글 검색 함수 생성

    await axios.get("http://localhost:8080/selectCommunity")            // 검색 -> 컨트롤러 요청

      .then((res) => {                                                // DB 검색 요청 후 응답
        postsValue.actions.setSelectAllPosts(res.data);         // 커뮤니티 모든 글 검색 데이터 저장
      })

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

  const [userProfiles, setUserProfiles] = useState({}); // 사용자 프로필 저장


  const fetchUserProfiles = async () => {
    try {
      const users = allPostList.map(post => post.user_num.userId);
      const response = await Promise.all(users.map(userId => axios.get(`http://localhost:8080/api/profile-image/${userId}`)));

      // response.forEach(({ data }) => {
      //   console.log("Fetched profile data:", data); // 추가된 로그
      // });

      const profiles = response.reduce((acc, { data }) => {
        if (data.userId) {
          acc[data.userId] = data.profileImageUrl;
        }
        // else {
        //   console.warn('No userId found in response data:', data);
        // }
        return acc;
      }, {});
      setUserProfiles(profiles);
    } catch (error) {
      console.error('사용자 프로필 조회 오류:', error);
    }
  };

  useEffect(() => {
    selectAllPosts();
  }, []);

  useEffect(() => {
    if (allPostList.length) {
      fetchUserProfiles();
    }
  }, [allPostList]);

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
        <Tooltip title={"글 작성"}>
          <button onClick={insertCommunity} className='community-insertBtn'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M15.9 5.1a2 2 0 0 1 2.8 2.8L8.2 19.6a2 2 0 0 1-1.2.4H3v-4.2a2 2 0 0 1 .4-1.2L15.9 5.1z" />
              <path d="M18.6 7.4l-1.4-1.4" />
            </svg>
          </button>
        </Tooltip>
      </div>
      <ul className="post-list">
        {allPostList.map(post => (
          <li key={post.id} className="post-item">
            <Tooltip title={"마이페이지"} placement='top-start'>
              <div className="post-item-top">
                <Link className="no-underline-link" to={`/MemberPage?id=${post.user_num.userId}`} state={{ id: post.user_num.userId }}>
                  <div className='post-item-profile'>
                    <img
                      src={
                        userProfiles[post.user_num.userId]
                          ? // 사용자의 프로필 URL이 http로 시작하면 그대로 사용
                          userProfiles[post.user_num.userId].startsWith('http')
                            ? userProfiles[post.user_num.userId]
                            : // 그렇지 않으면 로컬 서버 경로로 보정
                            `http://localhost:8080${userProfiles[post.user_num.userId]}`
                          : // 프로필 이미지가 없을 경우 기본 이미지 사용
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      className="profile-image"
                      alt=""
                      onError={(e) => {
                        // 이미지 로드 실패 시 기본 이미지로 대체
                        e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                      }}
                    />
                  </div>
                </Link>
                <Link className="no-underline-link" to={`/MemberPage?id=${post.user_num.userId}`} state={{ id: post.user_num.userId }}>
                  <div className='post-item-info'>
                    <div className='post-item-userNickname'>{post.user_num.userNickname}</div>
                    <div className='post-item-created_at'>{createAtCal(post.created_at)}</div>
                  </div>
                </Link>
              </div>
            </Tooltip>

            <div className="post-item-middle">
              <Tooltip title={"상세 보기"} placement='top-start'>
                <div className='post-item-title'>
                  <Link className="no-underline-link" to={`/DetailCommunity?id=${post.id}`} state={{ id: post.id }}>
                    {post.title}<br />
                  </Link>
                </div>

                <div className='post-item-contents'>
                  <Link className="no-underline-link" to={`/DetailCommunity?id=${post.id}`} state={{ id: post.id }}>
                    {post.contents}<br />
                  </Link>
                </div>
              </Tooltip>
            </div>

            <div className="post-item-bottom">
              <div className='post-item-uploadFile'>
                {post.image_path &&
                  (<img src={`http://localhost:8080/uploads/${post.image_path}`}
                    alt={"업로드 이미지"}
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
                      e.target.src = "uploadFailDefault.png";
                    }} />)}
              </div>
            </div>

            <div className="post-item-actions">
              <UserLike postId={post.id} />
              <ReplyBtn postId={post.id} />
              <Share post={post} />
              <Bookmark postId={post.id} />
            </div>
          </li>
        ))}
      </ul>
    </div >
  );
}

export default Posts;
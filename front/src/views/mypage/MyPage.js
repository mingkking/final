import React from 'react';
import './MyPage.css';
import { useContext, useRef, useState, useEffect } from 'react';
import LoginContext from '../login/contexts/LoginContext';
import { Avatar } from '@mui/material';
import UploadImage from './component/UploadImage';
import axiosInstance from '../login/component/Token/axiosInstance';
import "./component/UploadImage.css";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import UserLike from '../community/components/UserLike/UserLike';
import Reply from '../community/components/Reply/Reply';
import Share from '../community/components/Share/Share';
import Bookmark from '../community/components/Bookmark/Bookmark';
import CommunityContext from '../community/contexts/CommunityContext';

const MyPage = () => {

  const { state, actions } = useContext(LoginContext);
  const [profileImage, setProfileImage] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
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

//------------------------------------------------------
const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onBlur' });
    const navigate = useNavigate();
    const [nicknameExists, setNicknameExists] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(false);
    

    const onSubmit = async (data) => {
      try {
        // 데이터 전송 전에 userId와 함께 전송
        const response = await axiosInstance.put(`/user/${state.userId}`, {
          userId: state.userId,
          ...data
        });
        alert("정보가 업데이트 되었습니다.");
        actions.setAfterLoginNick(data.userNickname);
        navigate('/'); 
      } catch (error) {
        alert("정보를 정확히 입력해주세요. \n업데이트 실패: " + error.response?.data || error.message);
      }
    };

    

    const checkNicknameExists = async (nickname) => {
        try {
            setNicknameChecked(false);
            const response = await axiosInstance.get(`/check-nickname?nickname=${nickname}`);
            const exists = response.data;
            setNicknameExists(exists);
            setNicknameChecked(true);
        } catch (error) {
            console.error('Error checking nickname:', error);
            alert('Error checking nickname. ' + error);
        }
    };


    //---------------------------------------------------------------

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

  useEffect(() => {
    const userId = state.userId;
    

    // user_num의 userId 필드를 사용하여 필터링
    const filteredPosts = communityContext.state.selectAllPosts.filter(post => {
      
      return post.user_num.userId === userId; // userId 필드로 필터링
    });

    
    setMyPosts(filteredPosts);
  }, [state.userId, communityContext.state.selectAllPosts]);

    return (
      <div className="mypage-container">
        
        <div className="profile-section">
          
          <div className="profile-info">
            <div className="profile-avatar-container">
              <Avatar
                src={profileImage || state.profileImage}
                alt="Profile"
                sx={{ width: 100, height: 100 }}
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
          
          
          {isEditing && (
            <div className="form-section">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="userId">아이디</label>
                    <input
                      type="text"
                      id="userId"
                      placeholder="아이디"
                      value={state.userId}
                      readOnly
                    />  
                </div>

                

                    {errors.userName && <p className='err'>{errors.userName.message}</p>}

                    <div className="form-group">
                        <label htmlFor="userNickname">닉네임</label>
                        <input
                            type="text"
                            id="userNickname"
                            placeholder="닉네임"
                            {...register('userNickname', {
                                required: '닉네임은 필수 항목입니다.',
                                minLength: {
                                    value: 2,
                                    message: '최소 2글자 이상이어야 합니다.'
                                },
                                maxLength: {
                                    value: 10,
                                    message: '최대 10글자까지 가능합니다.'
                                },
                                onChange: (e) => {
                                    checkNicknameExists(e.target.value);
                                }
                            })}
                        />
                    </div>

                    {errors.userNickname && <p className='err'>{errors.userNickname.message}</p>}
                        {nicknameChecked && (
                            <>
                                {nicknameExists && <p className="err">이미 존재하는 닉네임입니다.</p>}
                            </>
                        )}

                    <div className="form-group">
                        <label htmlFor="userTel">전화번호</label>
                        <input
                            type="text"
                            id="userTel"
                            placeholder="전화번호"
                            {...register('userTel', {
                                required: '전화번호는 필수 항목입니다.',
                                pattern: {
                                    value: /^\d{3}-\d{3,4}-\d{4}$/,
                                    message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'
                                }
                            })}
                        />
                        
                    </div>

                    {errors.userTel && <p className='err'>{errors.userTel.message}</p>}

                    <div className="form-group">
                        <label htmlFor="userEmail">이메일</label>
                        <input
                            type="email"
                            id="userEmail"
                            placeholder="이메일"
                            {...register('userEmail', {
                                required: '이메일은 필수 항목입니다.',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: '유효한 이메일 주소를 입력하세요.'
                                }
                            })}
                        />
                    </div>

                    {errors.userEmail && <p className='err'>{errors.userEmail.message}</p>}

                    <button className="edit-profile-button">수정하기</button>
                
              </form>
            </div>
          )}
             <button onClick={() => setIsEditing(!isEditing)} className="edit-profile-toggle-button">
          {isEditing ? '취소' : '프로필 편집'}
        </button>
          <hr/>
           
          <div className="my-posts">
          
          <h3>내가 쓴 글</h3>
          <ul className="post-list">
            {myPosts.length > 0 ? (
              myPosts.map(post => (
                <li key={post.id} className="post-item">
                  <div className="post-item-top">
                    <div className='post-item-profile'>
                      <Avatar
                        src={profileImage || state.profileImage}
                        alt="Profile"
                        sx={{ width: 35, height: 35 }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
                        }}
                      />
                    </div>
                    <div className='post-item-info'>
                      <div className='post-item-userNickname'>{state.afterLoginNick}</div>
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
                    <UserLike postId={post.id} />
                    <Reply />
                    <Share />
                    <Bookmark />
                  </div>
                </li>
              ))
            ) : (
              <p>작성한 게시글이 없습니다.</p>
            )}
          </ul>
      </div>



        </div>

        <div className='my-interest'>

          <h3>내 관심종목</h3>
          <div className='my-interest-item'>
            <div>비트코인</div>
            <div>도지코인</div>
            <div>삼성전자</div>
            <div>테슬라</div>
          </div>
        </div>
        
    </div>
      
    );
  };
export default MyPage;
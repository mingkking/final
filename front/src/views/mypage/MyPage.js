import React from 'react';
import './MyPage.css';
import { useContext, useRef, useState, useEffect } from 'react';
import LoginContext from '../login/contexts/LoginContext';
import { Avatar } from '@mui/material';
import UploadImage from './component/UploadImage';
import axiosInstance from '../login/component/Token/axiosInstance';
import imges from '../../imges/dduksang.jpeg';
import "./component/UploadImage.css";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

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
          <hr/>
          
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

                <div className="form-group">
                  <label htmlFor="userName">이름</label>
                  <input
                    type="text"
                    id="userName"
                    placeholder="이름"
                    {...register('userName', {
                      required: '이름은 필수 항목입니다.',
                      pattern: {
                        value: /^[가-힣]{2,5}$/,
                        message: '한글 2글자에서 5글자 사이여야 합니다.'
                      }
                    })}
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
          <hr/>
            <div className='my-interest'>

              <h3>내 관심종목</h3>
            </div>




        </div>
        <div className="my-posts">
          <h3>내가 쓴 글</h3>
          <div className="post">
            <div className="post-header">
              <Avatar
                src={profileImage || state.profileImage}
                alt="Profile"
                sx={{ width: 60, height: 60 }}
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
              <h3>오늘 도지코인 매수 했습니다!!</h3>
              <h3>  화성 갈끄니끄아~!!</h3>
              <div className="post-image-placeholder">
                <img src={imges} alt="Post" />
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
    );
  };
export default MyPage;
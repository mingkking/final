import React from 'react';
import './Join.css';
import axiosInstance from '../../login/component/Token/axiosInstance';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

function ProfileUpdate() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onBlur' });
    const navigate = useNavigate();
    const [usernameExists, setUsernameExists] = useState(false);
    const [nicknameExists, setNicknameExists] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false);
    const [usernameLengthValid, setUsernameLengthValid] = useState(false);
    const [nicknameChecked, setNicknameChecked] = useState(false);
    

    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post('/join', data);
            alert(response.data);
            navigate('/Login');
        } catch (error) {
            alert("정보를 정확히 입력해주세요. \n가입실패: " + error.response.data);
        }
    };

    const checkUsernameExists = async (userId) => {
        if (!userId) return;
        try {
            setUsernameChecked(false);
            const response = await axiosInstance.get(`/check-username?userId=${userId}`);
            const exists = response.data;
            setUsernameExists(exists);
            setUsernameChecked(true);
            setUsernameLengthValid(userId.length >= 8);
        } catch (error) {
            console.error('Error checking username:', error);
            alert('Error checking username. ' + error);
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
        <div className="signup-container">
            
            <div className="form-section">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="userId">아이디</label>
                        <input
                            type="text"
                            id="userId"
                            placeholder="아이디"
                            {...register('userId', {
                                required: '아이디는 필수 항목입니다.',
                                pattern: {
                                    value: /^[a-zA-Z0-9]{8,12}$/,
                                    message: '영문과 숫자를 포함하여 8글자에서 12글자 사이여야 합니다.'
                                }
                            })}
                        />
                        <button type="button" className="check-button" onClick={() => checkUsernameExists(watch('userId'))}>중복확인</button>
                        {errors.userId && <p className='err'>{errors.userId.message}</p>}
                        {usernameChecked && (
                            <>
                                {usernameExists && <p className="err">이미 존재하는 아이디입니다.</p>}
                                {!usernameExists && usernameLengthValid && <p className='suc'>사용 가능한 아이디입니다.</p>}
                            </>
                        )}
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
                        {errors.userName && <p className='err'>{errors.userName.message}</p>}
                    </div>

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
                        {errors.userNickname && <p className='err'>{errors.userNickname.message}</p>}
                        {nicknameChecked && (
                            <>
                                {nicknameExists && <p className="err">이미 존재하는 닉네임입니다.</p>}
                            </>
                        )}
                    </div>

                   

                    

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
                        {errors.userTel && <p className='err'>{errors.userTel.message}</p>}
                    </div>

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
                        {errors.userEmail && <p className='err'>{errors.userEmail.message}</p>}
                    </div>

                    

                    <button type="submit" className="signup-button">저장하기</button>
                </form>
            </div>
        </div>
    );
}

export default ProfileUpdate;
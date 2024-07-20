import React from 'react';
import "./Join.css";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SubmitHandler, useForm } from 'react-hook-form';

// axios.defaults.baseURL = 'http://localhost:8080';

function Join() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onBlur' });
    const navigate = useNavigate();
    const [usernameExists, setUsernameExists] = useState(false);
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [agreeAll, setAgreeAll] = useState(false);

    

     // 폼 제출 시 호출되는 함수
    const onSubmit = async (data) => {

        try {
            const response = await axios.post('/api/join', data);
            alert(response.data);
            navigate('/Login');
        } catch (error) {
            alert("정보를 정확히 입력해주세요. \n가입실패: "+error.response.data);
        }
    };

    // 아이디 중복검사
    const checkUsernameExists = async (userId) => {
        try {
            const response = await axios.get(`/api/check-username?userId=${userId}`);
            setUsernameExists(response.data);
            
            if(!response.data){
                setIsValidUsername(true);
            }

        } catch (error) {
            console.error('Error checking username:', error);
            alert('Error checking username.');
        }
    };

    // 비밀번호 비교
    const userPass = watch('userPass');

     // 개별 약관 체크박스 상태
     const [agree1, setAgree1] = useState(false);
     const [agree2, setAgree2] = useState(false);
 
     // 개별 약관 체크박스가 변경될 때 호출되는 함수
     const handleSingleCheck = (id, checked) => {
         if (id === 'agree1') {
             setAgree1(checked);
         } else if (id === 'agree2') {
             setAgree2(checked);
         }
 
         // 모든 개별 약관 체크박스가 체크되었는지 확인
         if (agree1 && agree2) {
             setAgreeAll(true);
         } else {
             setAgreeAll(false);
         }
     };
 
     // 전체 동의하기 체크박스 클릭 시 호출되는 함수
     const handleAllCheck = (checked) => {
         setAgreeAll(checked);
         setAgree1(checked);
         setAgree2(checked);
     };
    

    return (
        <div className="signup-container">
            <div className="agreement-section">
                <div className='allCheck'>
                    <input type="checkbox" id="allAgree" onChange={(e) => handleAllCheck(e.target.checked)} checked={agreeAll}/>
                    <label htmlFor="allAgree"> 전체 동의하기</label>
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content">[약관 내용]</div>
                    <span> 위 약관에 동의합니까?(필수)</span>
                    <input type="checkbox" id="agree1" onChange={(e) => handleSingleCheck(e.target.id, e.target.checked)} checked={agree1} required/>
                    <label htmlFor="agree1"> 동의합니다</label>                    
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content">[약관 내용]</div>
                    <span> 위 약관에 동의합니까?(필수)</span>
                    <input type="checkbox" id="agree2" onChange={(e) => handleSingleCheck(e.target.id, e.target.checked)} checked={agree2} required/>
                    <label htmlFor="agree2"> 동의합니다</label>                    
                </div>
                
            </div>
            <div className="form-section">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label>아이디</label>
                    <input 
                        type="text" 
                        name="userId" 
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
                </div>
                
                {errors.userId && <p className='err'>{errors.userId.message}</p>}
                {usernameExists && !isValidUsername && <p className="err">이미 존재하는 아이디입니다.</p>}
                {isValidUsername && <p className='suc'>사용 가능한 아이디입니다.</p>}
                <div className="form-group">
                    <label>이름</label>
                    <input 
                        type="text" 
                        name="userName" 
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
                    <label>닉네임</label>
                    <input 
                        type="text" 
                        name="userNickname" 
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
                            }
                          })}
                    />
                                       
                </div>
                
                    {errors.userNickname && <p className='err'>{errors.userNickname.message}</p>}
                
                <div className="form-group">
                    <label>비밀번호</label>
                    <input 
                        type="password" 
                        name="userPass" 
                        placeholder="비밀번호"  
                        {...register('userPass', {
                            required: '비밀번호는 필수 항목입니다.',
                            pattern: {
                              value: /^(?=.*[a-zA-Z])(?=.*?[0-9])(?=.*[!@#$%^&*]).{8,12}$/,
                              message: '영문, 숫자, 특수문자를 포함한 8글자에서 12글자 사이여야 합니다.'
                            }
                        })}
                    />
                    
                </div>
                
                    {errors.userPass && <p className='err'>{errors.userPass.message}</p>}
                
                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input 
                        type="password" 
                        name="userPassConfirm" 
                        placeholder="비밀번호 확인"  
                        {...register('userPassConfirm', {
                            required: '비밀번호 확인은 필수 항목입니다.',
                            validate: value =>
                              value === userPass || '비밀번호가 일치하지 않습니다'
                          })}
                    />
                    
                </div>
                
                    {errors.userPassConfirm && <p className='err'>{errors.userPassConfirm.message}</p>}
                
                <div className="form-group">
                    <label>전화번호</label>
                    <input 
                    type="text" 
                    name="userTel" 
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
                    <label>이메일</label>
                    <input 
                        type="email" 
                        name="userEmail" 
                        placeholder="이메일"  
                        {...register('userEmail', {
                            required: '이메일은 필수 항목입니다.',
                            pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '유효한 이메일 주소를 입력하세요.'
                            }
                          })}
                    />
                    
                    <button type="button" className="send-button">발송</button>
                </div>
                
                    {errors.userEmail && <p className='err'>{errors.userEmail.message}</p>}
                
                <button type="submit" className="signup-button">가입하기</button>
            </form>
            </div>
        </div>
    );
}

export default Join
import React from 'react';
import "./Join.css";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Token/axiosInstance';
import { SubmitHandler, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Join() {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({ mode: 'onBlur' });
    const navigate = useNavigate();
    const [usernameExists, setUsernameExists] = useState(false);
    const [nicknameExists, setNicknameExists] = useState(false); // 닉네임 중복 여부
    const [isValidUsername, setIsValidUsername] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false); // 중복검사 여부 확인
    const [usernameLengthValid, setUsernameLengthValid] = useState(false); // 아이디 길이 유효성 검사
    const [nicknameChecked, setNicknameChecked] = useState(false); // 닉네임 중복검사 여부
    const [agreeAll, setAgreeAll] = useState(false);
    const [startDate, setStartDate] = useState(null);
    

     // 폼 제출 시 호출되는 함수
    const onSubmit = async (data) => {

        try {
            const response = await axiosInstance.post('/join', data);
            alert(response.data);
            navigate('/Login');
        } catch (error) {
            alert("정보를 정확히 입력해주세요. \n가입실패: "+error.response.data);
        }
    };

    // 아이디 중복검사
    const checkUsernameExists = async (userId) => {
        if (!userId) return; // 사용자 아이디가 비어있다면 아무것도 하지 않음
        try {
            setUsernameChecked(false); // 중복검사 시작 전에 false로 설정
            const response = await axiosInstance.get(`/check-username?userId=${userId}`);
            const exists = response.data;
            setUsernameExists(exists);
            setUsernameChecked(true); // 중복검사 완료 후 true로 설정


            // 아이디 길이 유효성 검사
            setUsernameLengthValid(userId.length >= 8);
            
        } catch (error) {
            console.error('Error checking username:', error);
            alert('Error checking username. ' + error);
        }
    };

     // 닉네임 중복검사
     const checkNicknameExists = async (nickname) => {
        
        try {
            setNicknameChecked(false); // 중복검사 시작 전에 false로 설정
            const response = await axiosInstance.get(`/check-nickname?nickname=${nickname}`);
            const exists = response.data;
            setNicknameExists(exists);
            setNicknameChecked(true); // 중복검사 완료 후 true로 설정

        } catch (error) {
            console.error('Error checking nickname:', error);
            alert('Error checking nickname. ' + error);
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
 
          // 하나라도 체크 해제되면 전체 동의하기 체크박스 해제
        if (!checked) {
            setAgreeAll(false);
        }
     };
 
     // 전체 동의하기 체크박스 클릭 시 호출되는 함수
     const handleAllCheck = (checked) => {
         setAgreeAll(checked);
         setAgree1(checked);
         setAgree2(checked);
     };

      // 개별 체크박스의 상태가 변경될 때 전체 동의 체크박스 상태를 업데이트
    useEffect(() => {
        if (agree1 && agree2) {
            setAgreeAll(true);
        } else {
            setAgreeAll(false);
        }
    }, [agree1, agree2]);

    const handleDateChange = (date) => {
        setStartDate(date);
        if (date) {
            const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, '').slice(2);
            setValue('userBirthdate', formattedDate, { shouldValidate: true });
        }
    };

    const validateDate = (value) => {
        const year = parseInt(value.substring(0, 2), 10);
        const month = parseInt(value.substring(2, 4), 10) - 1; 
        const day = parseInt(value.substring(4, 6), 10);

        const fullYear = year <= (new Date().getFullYear() % 100) ? 2000 + year : 1900 + year;
        const date = new Date(fullYear, month, day);
        
        
        return date.getFullYear() === fullYear &&
               date.getMonth() === month &&
               date.getDate() === day;
    };
    

    return (
        <div className="signup-container">
            <div className="agreement-section">
                <div className='allCheck'>
                    <input 
                        type="checkbox" 
                        id="allAgree" 
                        
                        onChange={(e) => handleAllCheck(e.target.checked)} 
                        checked={agreeAll}
                    />
                    <label htmlFor="allAgree"> 전체 동의하기</label>
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content">[약관 내용]</div>
                    <span> 위 약관에 동의합니까?(필수)</span>
                    <input 
                        type="checkbox" 
                        id="agree1" 
                        {...register('agree1', { required: '개별 약관 1은 필수 항목입니다.' })}
                        onChange={(e) => handleSingleCheck(e.target.id, e.target.checked)} 
                        checked={agree1}
                        />
                    <label htmlFor="agree1"> 동의합니다</label>                    
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content">[약관 내용]</div>
                    <span> 위 약관에 동의합니까?(필수)</span>
                    <input 
                        type="checkbox" 
                        id="agree2" 
                        {...register('agree2', { required: '개별 약관 2는 필수 항목입니다.' })}
                        onChange={(e) => handleSingleCheck(e.target.id, e.target.checked)} 
                        checked={agree2} required/>
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
                {usernameChecked && (
                        <>
                            {usernameExists && <p className="err">이미 존재하는 아이디입니다.</p>}
                            {!usernameExists && usernameLengthValid && <p className='suc'>사용 가능한 아이디입니다.</p>}
                        </>
                    )}
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
                            },
                            onChange: (e) => {
                                // 닉네임 중복 검사 실행
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
                    
                    
                </div>
                
                    {errors.userEmail && <p className='err'>{errors.userEmail.message}</p>}
                
                    <div className="form-group">
                        <label>생년월일</label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="생년월일을 선택하세요"
                            maxDate={new Date()}
                            showYearDropdown
                            showMonthDropdown
                            dropdownMode="select"
                            className="form-control"
                        />
                        <input
                            type="hidden"
                            name="userBirthdate"
                            {...register('userBirthdate', {
                                required: '생년월일은 필수 항목입니다.',
                                validate: validateDate
                            })}
                        />
                    </div>
                    
                    {errors.userBirthdate && <p className='err'>{errors.userBirthdate.message}</p>}
                    

                <button type="submit" className="signup-button">가입하기</button>
            </form>
            </div>
        </div>
    );
}

export default Join
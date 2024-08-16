import React from 'react';
import "./Join.css";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Token/axiosInstance';
import { SubmitHandler, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

function Join() {
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({ mode: 'onBlur' });
    const navigate = useNavigate();
    const [usernameExists, setUsernameExists] = useState(false); // 아이디 중복 여부
    const [usernameChecked, setUsernameChecked] = useState(false); // 중복검사 여부 확인
    const [usernameLengthValid, setUsernameLengthValid] = useState(false); // 아이디 길이 유효성 검사
    const [nicknameExists, setNicknameExists] = useState(false); // 닉네임 중복 여부
    const [nicknameChecked, setNicknameChecked] = useState(false); // 닉네임 중복검사 여부
    const [useremailExists, setUseremailExists] = useState(false); // 이메일 중복 여부
    const [usertelExists, setUsertelExists] = useState(false); // 전화번호 중복 여부
    const [useremailChecked, setUseremailChecked] = useState(false); // 이메일 중복검사 여부
    const [usertelChecked, setUsertelChecked] = useState(false); // 전화번호 중복검사 여부
    const [agreeAll, setAgreeAll] = useState(false);
    const [startDate, setStartDate] = useState(null);
    

     // 폼 제출 시 호출되는 함수
    const onSubmit = async (data) => {
        
        // 체크박스 상태 확인
        if (!agree1 || !agree2) {
            alert("모든 필수 약관에 동의해야 합니다.");
            return;
        }

        try {
            const response = await axiosInstance.post('/join', data);
            alert("회원가입이 완료되었습니다.");
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

     // 이메일 중복검사
     const checkEmailExists = async (userEmail) => {
        try {
            setUseremailChecked(false); // 중복검사 시작 전에 false로 설정
            const response = await axiosInstance.get(`/check-email?email=${userEmail}`);
            const exists = response.data;
            setUseremailExists(exists);
            setUseremailChecked(true); // 중복검사 완료 후 true로 설정

        } catch (error) {
            console.error('Error checking email:', error);
            alert('Error checking email. ' + error);
        }
    };

    // 전화번호 중복검사
    const checkTelExists = async (userTel) => {
        try {
            setUsertelChecked(false); // 중복검사 시작 전에 false로 설정
            const response = await axiosInstance.get(`/check-tel?usertel=${userTel}`);
            const exists = response.data;
            setUsertelExists(exists);
            setUsertelChecked(true); // 중복검사 완료 후 true로 설정

        } catch (error) {
            console.error('Error checking phone:', error);
            alert('Error checking phone. ' + error);
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
            document.getElementById('allAgree').checked = true;
        } else {
            document.getElementById('allAgree').checked = false;
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
        <div className="signup-container" style={{backgroundColor:'#212737'}}>
            <div className="agreement-section">
                <div className='allCheck'>
                    <input 
                        type="checkbox" 
                        id="allAgree" 
                        
                        onChange={(e) => handleAllCheck(e.target.checked)} 
                        checked={agreeAll}
                    />
                    <label htmlFor="allAgree" style={{color:'#fff'}}> 전체 동의하기</label>
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content" style={{backgroundColor:'#282E3C', color:'#fff'}}>
                    여러분을 환영합니다.
                    InvestGate에 서비스 및 제품(이하 ‘서비스’)을 이용해 주셔서 감사합니다. 본 약관은 다양한 InvestGate에 서비스의 이용과 관련하여 InvestGate에 서비스를 제공하는 InvestGate에와 이를 이용하는 InvestGate 서비스 회원(이하 ‘회원’) 또는 비회원과의 관계를 설명하며, 아울러 여러분의 InvestGate에 서비스 이용에 도움이 될 수 있는 유익한 정보를 포함하고 있습니다.
                    </div>
                    <span style={{color:'#fff'}}> 위 약관에 동의합니까?(필수)</span>
                    <input 
                        type="checkbox" 
                        id="agree1"        
                        onChange={(e) => handleSingleCheck(e.target.id, e.target.checked)} 
                        checked={agree1}
                        />
                    <label htmlFor="agree1" style={{color:'#fff'}}> 동의합니다</label>                    
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content" style={{backgroundColor:'#282E3C',color:'#fff'}}>
                    개인정보보호법에 따라 InvestGate에 회원가입 신청하시는 분께 수집하는 개인정보의 항목, 개인정보의 수집 및 이용목적, 개인정보의 보유 및 이용기간, 동의 거부권 및 동의 거부 시 불이익에 관한 사항을 안내 드리오니 자세히 읽은 후 동의하여 주시기 바랍니다.

                    1. 수집하는 개인정보
                    용자는 회원가입을 하지 않아도 정보 검색, 뉴스 보기 등 대부분의 InvestGate에 서비스를 회원과 동일하게 이용할 수 있습니다. 이용자가 메일, 캘린더, 카페, 블로그 등과 같이 개인화 혹은 회원제 서비스를 이용하기 위해 회원가입을 할 경우, InvestGate에 서비스 이용을 위해 필요한 최소한의 개인정보를 수집합니다.

                    회원가입 시점에 InvestGate에 이용자로부터 수집하는 개인정보는 아래와 같습니다.
                    - 회원 가입 시 필수항목으로 아이디, 비밀번호, 이름, 생년월일, 성별, 휴대전화번호를, 선택항목으로 본인확인 이메일주소를 수집합니다. 실명 인증된 아이디로 가입 시, 암호화된 동일인 식별정보(CI), 중복가입 확인정보(DI), 내외국인 정보를 함께 수집합니다. 만 14세 미만 아동의 경우, 법정대리인의 동의를 받고 있으며, 휴대전화번호 또는 아이핀 인증을 통해 법정대리인의 동의를 확인하고 있습니다. 이 과정에서 법정대리인의 정보(법정대리인의 이름, 중복가입확인정보(DI), 휴대전화번호(아이핀 인증인 경우 아이핀번호))를 추가로 수집합니다.
                    - 비밀번호 없이 회원 가입 시에는 필수항목으로 아이디, 이름, 생년월일, 휴대전화번호를, 선택항목으로 비밀번호를 수집합니다.
                    - 단체 회원가입 시 필수 항목으로 단체아이디, 비밀번호, 단체이름, 이메일주소, 휴대전화번호를, 선택항목으로 단체 대표자명을 수집합니다.
                    서비스 이용 과정에서 이용자로부터 수집하는 개인정보는 아래와 같습니다.
                    - 회원정보 또는 개별 서비스에서 프로필 정보(별명, 프로필 사진)를 설정할 수 있습니다. 회원정보에 별명을 입력하지 않은 경우에는 마스킹 처리된 아이디가 별명으로 자동 입력됩니다.
                    - InvestGate에 내의 개별 서비스 이용, 이벤트 응모 및 경품 신청 과정에서 해당 서비스의 이용자에 한해 추가 개인정보 수집이 발생할 수 있습니다. 추가로 개인정보를 수집할 경우에는 해당 개인정보 수집 시점에서 이용자에게 ‘수집하는 개인정보 항목, 개인정보의 수집 및 이용목적, 개인정보의 보관기간’에 대해 안내 드리고 동의를 받습니다.



                    </div>
                    <span style={{color:'#fff'}}> 위 약관에 동의합니까?(필수)</span>
                    <input 
                        type="checkbox" 
                        id="agree2"                         
                        onChange={(e) => handleSingleCheck(e.target.id, e.target.checked)} 
                        checked={agree2} required/>
                    <label htmlFor="agree2" style={{color:'#fff'}}> 동의합니다</label>                    
                </div>
                
            </div>
            <div className="join-form-section">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="join-form-group">
                    <label style={{color:'#fff'}}>아이디</label>
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
                     
                    <button type="button" className="id-check-button" onClick={() => checkUsernameExists(watch('userId'))}>중복확인</button>                                           
                </div>
                
                {errors.userId && <p className='err'>{errors.userId.message}</p>}
                {usernameChecked && !errors.userId &&(
                        <>
                            {usernameExists && <p className="err">이미 존재하는 아이디입니다.</p>}
                            {!usernameExists && usernameLengthValid && <p className='suc'>사용 가능한 아이디입니다.</p>}
                        </>
                    )}
                <div className="join-form-group">
                    <label style={{color:'#fff'}}>이름</label>
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
                   
                <div className="join-form-group">
                    <label style={{color:'#fff'}}>닉네임</label>
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
                    {nicknameChecked && !errors.userNickname &&(
                        <>
                            
                            {nicknameExists && <p className="err">이미 존재하는 닉네임입니다.</p>}
                        </>
                    )}

                <div className="join-form-group">
                    <label style={{color:'#fff'}}>비밀번호</label>
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
                
                <div className="join-form-group">
                    <label style={{color:'#fff'}}>비밀번호 확인</label>
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
                
                <div className="join-form-group">
                    <label style={{color:'#fff'}}>전화번호</label>
                    <input 
                    type="tel" 
                    name="userTel" 
                    placeholder="전화번호"  
                    {...register('userTel', {
                        required: '전화번호는 필수 항목입니다.',
                        pattern: {
                            value: /^\d{3}-\d{3,4}-\d{4}$/,
                            message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'
                          },
                        onChange: (e) => {
                            // 전화번호 중복 검사 실행
                            checkTelExists(e.target.value);
                        }
                      })}
                    />
                    
                </div>
                
                    {errors.userTel && <p className='err'>{errors.userTel.message}</p>}
                    {usertelChecked && !errors.userTel &&(
                        <>
                            
                            {usertelExists && <p className="err">이미 존재하는 전화번호입니다.</p>}
                        </>
                    )}
                
                <div className="join-form-group">
                    <label style={{color:'#fff'}}>이메일</label>
                    <input 
                        type="email" 
                        name="userEmail" 
                        placeholder="이메일"  
                        {...register('userEmail', {
                            required: '이메일은 필수 항목입니다.',
                            pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: '유효한 이메일 주소를 입력하세요.'
                            },
                            onChange: (e) => {
                                // 이메일 중복 검사 실행
                                checkEmailExists(e.target.value);
                            }
                          })}
                    />
                    
                    
                </div>
                
                    {errors.userEmail && <p className='err'>{errors.userEmail.message}</p>}
                    {useremailChecked && !errors.userEmail &&(
                        <>
                            
                            {useremailExists && <p className="err">이미 존재하는 이메일입니다.</p>}
                        </>
                    )}
                
                    <div className="join-form-group">
                        <label style={{color:'#fff'}}>생년월일</label>
                        <DatePicker
                            selected={startDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="생년월일을 선택하세요"
                            maxDate={new Date()}
                            locale={ko} 
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
                    

                <button type="submit" className="signup-button" style={{backgroundColor:'#BCB6AA', color:'#000'}}>가입하기</button>
            </form>
            </div>
        </div>
    );
}

export default Join;
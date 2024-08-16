import React, { useState } from 'react';
import './PwChange.css';
import axiosInstance from '../Token/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
 
const PwChange = () => {
    const { userId } = useParams(); // URL에서 userId를 추출
    const navigate = useNavigate();
    
    // react-hook-form의 useForm 훅을 사용하여 폼 상태 관리
    const { register, handleSubmit, formState: { errors }, watch } = useForm({ mode: 'onBlur' });

    const oldPassword = watch('oldPassword');

    // 비밀번호 변경 핸들러
    const onSubmit = async (data) => {
        try {
            const response = await axiosInstance.post('/PwChange', 
                { userId, oldPassword: data.oldPassword, newPassword: data.userPass }
            );

            if (response.status === 200) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                navigate('/Login'); // 로그인 페이지로 이동
            } else {
                alert("비밀번호 변경 실패. 다시 시도해 주세요.");
            }
        } catch (error) {
            console.error("There was an error!", error);
            alert("입력하신 정보가 일치하지 않습니다");
        }
    };

    return (
        <div className="centerPc-container d-flex justify-content-center align-items-center min-vh-100">
        <div className="pwchange-container">
            <h1>비밀번호 변경</h1>
            <form className="pwchange-form" onSubmit={handleSubmit(onSubmit)}>
                
                <div className="form-group">
                    <label htmlFor="oldPassword">현재 비밀번호</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        placeholder="현재 비밀번호"
                        {...register('oldPassword', { required: '현재 비밀번호는 필수 항목입니다.' })}
                    />
                    
                </div>
                {errors.oldPassword && <p className="er">{errors.oldPassword.message}</p>}
                
                <div className="form-group">
                    <label htmlFor="userPass">새 비밀번호</label>
                    <input
                        type="password"
                        id="userPass"
                        name="userPass"
                        placeholder="비밀번호"
                        {...register('userPass', {
                            required: '비밀번호는 필수 항목입니다.',
                            pattern: {
                                value: /^(?=.*[a-zA-Z])(?=.*?[0-9])(?=.*[!@#$%^&*]).{8,12}$/,
                                message: '영문, 숫자, 특수문자를 포함한 8글자에서 12글자 사이여야 합니다.'
                            },
                            validate: value =>
                                value !== oldPassword || '새 비밀번호는 현재 비밀번호와 달라야 합니다.'
                        })}
                    />
                    
                </div>
                {errors.userPass && <p className='er'>{errors.userPass.message}</p>}

                <div className="form-group">
                    <label htmlFor="confirmPassword">새 비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="새 비밀번호 확인"
                        {...register('confirmPassword', {
                            required: true,
                            validate: (value, formValues) => value === formValues.userPass || '비밀번호가 일치하지 않습니다.'
                        })}
                    />
                    
                </div>
                {errors.confirmPassword && <p className='er'>{errors.confirmPassword.message}</p>}

                <button type="submit" style={{backgroundColor:'#BCB6AA', color:'#000'}}>비밀번호 변경</button>
            </form>
        </div>
        </div>
    );
};

export default PwChange;
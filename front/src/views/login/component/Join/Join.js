import React from 'react';
import "./Join.css";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Join() {

    const [formData, setFormData] = useState({
        userId: '',
        userName: '',
        userNickname: '',
        userPass: '',
        userPassConfirm: '',
        userTel: '',
        userEmail: '',
    });

    const navigate = useNavigate();

    // 입력 값 변경 시 호출되는 함수
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 폼 제출 시 호출되는 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.userPass !== formData.userPassConfirm) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('/api/join', formData);
            alert(response.data);
            navigate('/Login');
        } catch (error) {
            alert(error.response.data);
        }
    };

    return (
        <div className="signup-container">
            <div className="agreement-section">
                <div>
                    <input type="checkbox" id="allAgree" />
                    <label htmlFor="allAgree"> 전체 동의하기</label>
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content">[약관 내용]</div>
                    <span> 위 약관에 동의합니까?(필수)</span>
                    <input type="checkbox" id="agree1" />
                    <label htmlFor="agree1"> 동의합니다</label>                    
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content">[약관 내용]</div>
                    <span> 위 약관에 동의합니까?(필수)</span>
                    <input type="checkbox" id="agree2" />
                    <label htmlFor="agree2"> 동의합니다</label>                    
                </div>
                <div className="agreement-box">                    
                    <div className="agreement-content">[약관 내용]</div>
                    <span> 위 약관에 동의합니까?(필수)</span>
                    <input type="checkbox" id="agree3" />
                    <label htmlFor="agree3"> 동의합니다</label>                    
                </div>
            </div>
            <div className="form-section">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>아이디</label>
                    <input type="text" name="userId" placeholder="아이디" onChange={handleChange} required/>
                    <button type="button" className="check-button">중복확인</button>
                </div>
                <div className="form-group">
                    <label>이름</label>
                    <input type="text" name="userName" placeholder="이름" onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>닉네임</label>
                    <input type="text" name="userNickname" placeholder="닉네임" onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>비밀번호</label>
                    <input type="password" name="userPass" placeholder="비밀번호" onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input type="password" name="userPassConfirm" placeholder="비밀번호 확인" onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>전화번호</label>
                    <input type="text" name="userTel" placeholder="전화번호" onChange={handleChange} required/>
                </div>
                <div className="form-group">
                    <label>이메일</label>
                    <input type="email" name="userEmail" placeholder="이메일" onChange={handleChange} required/>
                    <button type="button" className="send-button">발송</button>
                </div>
                <button type="submit" className="signup-button">가입하기</button>
            </form>
            </div>
        </div>
    );
}

export default Join
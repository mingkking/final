import React, { useState } from 'react';
import './PwFind.css';
import axiosInstance from '../Token/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

const PwFind = () => {
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState('');
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post('/PwFind',{
                email, userId
            });

            if (response.status === 200 && response.data) {
                // 인증 성공
                alert("인증 성공!");
                navigate(`/PwChange/${userId}`); // 비밀번호 변경 페이지로 이동
            } else {
                // 인증 실패
                alert("인증 실패. 정보를 확인해주세요.");
            }
        } catch (error) {
            console.error("There was an error!", error);
            
        }
    };

    return (
        <div className="pwfind-container">
            <h1>비밀번호 찾기</h1>
            <form className="pwfind-form" onSubmit={handleSubmit}>
                <label htmlFor="email">이메일</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                <label htmlFor="userId">아이디</label>
                <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                
                <br/><br/>
                <button type="submit">확인</button>

                
            </form>
        </div>
    );
};

export default PwFind;
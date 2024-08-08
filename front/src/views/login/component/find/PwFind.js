import React, { useState } from 'react';
import './PwFind.css';
import axiosInstance from '../Token/axiosInstance'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="center-container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card p-4 pwfind-container">
                <h1 className="text-center mb-4">비밀번호 찾기</h1>
                <form className="pwfind-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">이메일</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="userId">아이디</label>
                        <input
                            type="text"
                            id="userId"
                            name="userId"
                            className="form-control"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            required
                        />
                    </div> 

                    <button type="submit" className="btn btn-primary btn-block w-100">확인</button>
                </form>
            </div>
        </div>
    );
};

export default PwFind;
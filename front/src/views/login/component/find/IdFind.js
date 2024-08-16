import React, { useState } from 'react';
import './IdFind.css';
import axiosInstance from '../Token/axiosInstance'; 
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const IdFind = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
 
        try {
            const response = await axiosInstance.post('/IdFind', null, {
                params: { email, name, phone }
            });
            if (response.data) {
                
                // 화면 전환 로직 추가
                navigate('/IdConfirm', { state: { userId: response.data } });
            } else {
                // 인증 실패
                alert("인증 실패. 정보를 확인해주세요.");
            }
        } catch (error) {
            console.error("There was an error!", error);
        }
    };  

    return (
        <div className="centerSrh-container d-flex justify-content-center align-items-center">
        <div className="id-find-container">
            <h1 className="text-center mb-4">아이디 찾기</h1>
            <form className="id-find-form" onSubmit={handleSubmit}>
                
                <div className="mb-3">
                    <label htmlFor="email" className="id-find-form-label">이메일</label>
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
                
                <div className="mb-3">
                    <label htmlFor="name" className="id-find-form-label">이름</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                
                <div className="mb-3">
                    <label htmlFor="phone" className="id-find-form-label">전화번호</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                
                <button type="submit" className="btn btn-primary w-100" style={{backgroundColor:'#BCB6AA', color:'#000'}}>인증하기</button>
            </form>
        </div>
        </div>
    );
};

export default IdFind;
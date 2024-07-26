import React, { useState } from 'react';
import './IdFind.css';
import axiosInstance from '../Token/axiosInstance'; 
import { useNavigate } from 'react-router-dom';

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
                // 인증 성공
                alert("인증 성공!");
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
        <div className="id_container">
            <h1>아이디 찾기</h1>
            <form className="find-id-form" onSubmit={handleSubmit}>
                
                <label htmlFor="email">이메일</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                

                
                <label htmlFor="name">이름</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                

                
                <label htmlFor="phone">전화번호</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <br/><br/>
                <button type="submit">인증하기</button>

                
            </form>
        </div>
    );
};

export default IdFind;
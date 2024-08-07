import React from 'react';
import './IdConfirm.css'
import { useLocation, useNavigate } from 'react-router-dom';

const IdConfirm = () => {

    const location = useLocation(); 
    const navigate = useNavigate();
    const userId = location.state?.userId;


    return (
        <div className="id-confirm-container">
            <h2 className="text-center mb-4">아이디 찾기</h2>
            <main className="main-content text-center">
                <div className="result mb-4">
                    <p>귀하의 아이디는 <strong>{userId}</strong> 입니다</p>
                </div>
                <div className="buttons d-flex justify-content-center gap-3">
                    <button className="btn btn-primary" onClick={() => navigate('/Login')}>로그인하기</button>
                    <button className="btn btn-secondary" onClick={() => navigate('/PwFind')}>비밀번호 찾기</button>
                </div>
            </main>
        </div>
    );
};

export default IdConfirm;
import React from 'react';
import './IdConfirm.css'
import { useLocation, useNavigate } from 'react-router-dom';

const IdConfirm = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.state?.userId;
    return (
        <div className="id-find-container">
            <h2>아이디 찾기</h2>
            <main className="main-content">
                
                <div className="result">
                <p>귀하의 아이디는 <strong>{userId}</strong> 입니다</p>
                </div>
            </main>
            <br/>

                <div className="buttons">
                    <button className="button" onClick={() => window.location.href = '/Login' }>로그인하기</button>
                    <button className="button" onClick={() => window.location.href = '/PwFind' }>비밀번호 찾기</button>
                </div>
            
        </div>
    );
};

export default IdConfirm;
import React, { useState } from 'react';
import './IdFind.css'; 

const IdFind = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // 간단한 유효성 검사
        if (!email || !name || !phone) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        
        setSuccess(true);
        setError('');
    };

    return (
        <div className="id_container">
            <h1>아이디 찾기</h1>
            <form className="find-id-form" onSubmit={handleSubmit}>
                
                <label htmlFor="email">이메일:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                

                
                <label htmlFor="name">이름:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                

                
                <label htmlFor="phone">전화번호:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                
                <button type="submit">인증하기</button>

                {error && <p className="error">{error}</p>}
                {success && <p className="success">인증이 완료되었습니다.</p>}
            </form>
        </div>
    );
};

export default IdFind;
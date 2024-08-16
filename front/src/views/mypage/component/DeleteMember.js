import React, { useState, useContext } from 'react';

import axiosInstance from "../../login/component/Token/axiosInstance";
import { useNavigate } from 'react-router-dom';
import "./DeleteMember.css";
import LoginContext from '../../login/contexts/LoginContext';

const DeleteMember = () => {
   
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const { state, actions } = useContext(LoginContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason) {
            alert("탈퇴 이유를 선택해주세요.");
            return;
        }

        const userId = state.userId;

        if (!userId) {
            alert("사용자 정보가 없습니다.");
            return;
        }

        try {
            const response = await axiosInstance.post('/delete-member', { userId });
            if (response.status === 200) {

                actions.setUserId(""); // 사용자 ID 초기화
                actions.setAfterLoginNick(""); // 닉네임 초기화
                actions.setProfileImage(""); // 프로필 이미지 초기화
                
                alert("회원을 탈퇴하였습니다.");
                navigate('/');
            } else {
                alert("회원탈퇴가 취소되었습니다.");
            }
        } catch (error) {
            console.error("There was an error!", error);
        }
    };
    return (
        <div className="delete-member-container">
            <h1>회원탈퇴</h1>
            <p>정말로 InvestGate를 떠나시겠어요?<br />
                탈퇴를 하시면 InvestGate가 제공하는 백테스트, 관심종목 등의 기능을 더이상 사용하실 수 없어요.</p>
            <form className="delete-member-form" onSubmit={handleSubmit}>
                <h2 style={{ color:'#fff'}}>InvestGate를 떠나는 이유를 알려주세요.</h2>
                <div className="delete-form-group">
                    <label>
                        <input
                            type="radio"
                            value="앱을 잘 사용하지 않습니다."
                            checked={reason === "앱을 잘 사용하지 않습니다."}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        앱을 잘 사용하지 않습니다.
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="유용한 콘텐츠가 부족합니다."
                            checked={reason === "유용한 콘텐츠가 부족합니다."}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        유용한 콘텐츠가 부족합니다.
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="증권사 연동이 잘 안됩니다."
                            checked={reason === "증권사 연동이 잘 안됩니다."}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        증권사 연동이 잘 안됩니다.
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="보안관련 우려가 있습니다."
                            checked={reason === "보안관련 우려가 있습니다."}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        보안관련 우려가 있습니다.
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="앱의 속도나 안정성에 불만이 있습니다."
                            checked={reason === "앱의 속도나 안정성에 불만이 있습니다."}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        앱의 속도나 안정성에 불만이 있습니다.
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="직접 입력"
                            checked={reason === "직접 입력"}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        직접 입력
                    </label>
                    {reason === "직접 입력" && (
                        <input
                            type="text"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            placeholder="이유를 입력해주세요"
                            className="custom-reason-input"
                        />
                    )}
                </div>
                
                <div className="button-row">
                    <button type="submit" className="delete-button">탈퇴하기</button>
                </div>
            </form>
        </div>
    );
};

export default DeleteMember;
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Subscribe.css';
import axios from 'axios';
import { Hearts } from 'tabler-icons-react';
import { useContext, useEffect, useState } from 'react';
import SubscribeContext from './context/SubscribeContext';
import axiosInstance from "../login/component/Token/axiosInstance";

function Subscribe1() {

    const navigate = useNavigate(); // Detail 페이지 이동
    const [subDate, setSubDate] = useState("");

    const handleClickMain = () => {
        navigate(`/`);
    }

    // 로그인 / 구독 여부 확인 --> 컴포넌트 로딩 시
    useEffect(() => {
        const checkLoginAndSub = async () => {
            try {
                await loginCheck();
            } catch (error) {
                console.error("SubscribeSuccess.js 15행 함수 에러:", error);
            }
        };
        checkLoginAndSub();
    }, []);

    const loginCheck = async () => {
        try {
            const response = await axiosInstance.get('/check-login-status', { 
                withCredentials: true, 
            });
            // 구독 날짜 받아와서 date에 담기
            const date = await subscribeDate(response.data.userNum);
            // 구독 날짜 설정
            setSubDate(date);
        } catch (error) {
            console.error("SubscribeSuccess.js 26행 함수 에러:", error);
        }
    };

    // 구독 날짜 springboot에서 받아오는 함수
    const subscribeDate = async (user_num) => {
        try {
            const response = await axios.get(`http://localhost:8080/SubscribeSuccess/${user_num}`);
            return response.data;  // 구독 날짜만 반환
        } catch (error) {
            console.error("SubscribeSuccess.js 41행 함수 에러:", error);
            return "N/A"; // 에러 시 기본값 설정
        }
    };

    return (
        <div className='subscribe-container' style={{color:'#fff'}}>
            <div className='subscribe-img'>
                <Hearts size={50} />
            </div>
            <div className='subscribe-title'>
                <h4>{subDate}에 구독을 완료하셨습니다!</h4>
            </div>
            <div className='subscribe-content'>
                <span className='line-benefit'>주식 수익률을 예측 할 수 있는 백테스트 기능 사용 가능! </span>
                <span className='line-benefit'>동일 관심사를 가진 회원들과 채팅방 생성 및 채팅 가능!</span>
            </div>
            <Button  
                className='subscribe-nextBtn' 
                variant="contained" 
                color="success" 
                sx={{mt:10}}
                onClick={handleClickMain}
            >
                메인
            </Button>
        </div>
    );
}

export default Subscribe1;

import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Subscribe.css';
import axios from 'axios';
import { Hearts } from 'tabler-icons-react';
import { useContext, useEffect } from 'react';
import SubscribeContext from './context/SubscribeContext';
import axiosInstance from "../login/component/Token/axiosInstance";

function Subscribe1() {

    const navigate = useNavigate(); // Detail 페이지 이동
    const value = useContext(SubscribeContext);

    // 페이지 이동 함수
    const handleClickSC = () => {
        navigate('/Subscribe2');    
    }

    // 로그인 / 구독 여부 확인 --> 컴포넌트 로딩 시
    useEffect(() => {
        const checkLoginAndSub = async () => {
            await loginCheck();
        };
        checkLoginAndSub();
    }, []);
    
    // 로그인 / 구독 여부 함수
    const loginCheck = async () => {
        const response = await axiosInstance.get('/check-login-status', { 
            withCredentials: true, 
        });
    
        if (response.data.isLoggedIn !== true) {
            alert("로그인 후 이용해주세요!");   
            navigate("/login");                         
        } else {
            // 로그인 했으면 userNum 설정
            value.actions.setUserNum(response.data.userNum);

            // 비동기때문에 await 후 값 받아와서 subscribeTF 에 담기
            const subscribeTF = await checkSubcribe(response.data.userNum);

            // subscribeTF 값이 true 이면
            if (subscribeTF) {
                // alert("이미 구독이 완료되었습니다!");
                navigate("/subscribeSuccess");
            }
        }
    }
    
    // 구독 확인 springboot에서 값 받아오는 함수
    const checkSubcribe = async (user_num) => {

        // 로그인 한 유저의 user_num 을 springboot로 넘김
        const result = await axios.get(`http://localhost:8080/subscribe/${user_num}`);
        // boolean 값으로 result.data 값이 1이면 true, 아니면 false로 return
        return result.data === 1;
    }



    return (
        <div className='subscribe-container' style={{color:'#fff'}}>
            <div className='subscribe-img'>
                <Hearts size={50} />
            </div>
            <div className='subscribe-title'>
                <h4>구독 시 얻을 수 있는 혜택</h4>
            </div>
            <div className='subscribe-content'>
                <span className='line-benefit'>백테스트 기능 사용 가능</span>
                <span className='line-benefit'>동일 관심사를 가진 회원들과 채팅방 생성 및 채팅 가능</span>
            </div>
            <div className='subscribe-price'>
                <h6>한 번의 결제로 탈퇴시까지 사용 가능 (10,000원)</h6>
            </div>
            <Button  
                className='subscribe-nextBtn' 
                variant="contained" 
                color="success" 
                sx={{mt:10}}
                onClick={handleClickSC}
            >
                구독하기
            </Button>
        </div>
    );
}

export default Subscribe1;

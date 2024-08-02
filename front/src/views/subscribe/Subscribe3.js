import { Button } from '@mui/material';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Subscribe.css';
import { HeartHandshake, Check } from 'tabler-icons-react';


function Subscribe3() {

    const navigate = useNavigate();

    const handleClickMain = () => {
        navigate('/');    
      }

    return (
        <div>
            <div className='subscribe-img'>
            <HeartHandshake size={50} />
            </div>
            <div className='subscribe-title'>
              <h4>구독이 완료되었습니다! :D</h4>
            </div>
            <div className='subscribe-content'>
                <span className='line-benefit'><Check /> 백테스트 기능 사용 가능</span>
                <span className='line-benefit'><Check /> 동일 관심사를 가진 회원들과 채팅방 생성 및 채팅 가능</span>
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
  
  export default Subscribe3;
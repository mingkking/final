import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Subscribe.css';
import { Hearts } from 'tabler-icons-react';


function Subscribe1() {

    const navigate = useNavigate(); // Detail 페이지 이동

    const handleClickSC = () => {
        navigate('/Subscribe2');    
      }
  
    return (
        <div>
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
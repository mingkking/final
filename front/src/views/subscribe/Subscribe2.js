import React, { useState, useEffect, useContext } from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ReportMoney } from 'tabler-icons-react';
import axios from 'axios';
import SubscribeContext from './context/SubscribeContext';

const Subscribe2 = () => {

  const navigate = useNavigate();
  const value = useContext(SubscribeContext);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [impReady, setImpReady] = useState(false);
  const [orderNum, setOrderNum] = useState(makeOrderNum());

  function makeOrderNum() {
    const date = new Date;
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // 6자리 랜덤 숫자
    return `${year}${month}${day}${randomNum}`;
  }

  // 결제 script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.iamport.kr/v1/iamport.js';
    script.async = true;
    script.onload = () => setImpReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 카드 결제 시 출력
  const cardPay = () => {
    if (!impReady) {
      alert('로딩중...');
      return;
    }

    const { IMP } = window;
    IMP.init('imp14260610'); // 가맹점 식별코드

    const data = {
      pg: "uplus", // PG Provider
      pay_method: 'card',
      merchant_uid: orderNum.toString(),
      amount: '10000', // 결제 금액
      name: 'InvestiGate 구독',
      buyer_name: '홍길동',
      buyer_tel: '010-1234-5678',
      buyer_email: 'example@example.com',
      buyer_addr: '서울특별시 강남구 삼성동',
      buyer_postcode: '123-456',
    };

    IMP.request_pay(data, callback);
  };

  // kakaopay 결제 시 출력
  const kakaoPay = () => {
    if (!impReady) {
      alert('로딩중...');
      return;
    }

    const { IMP } = window;
    IMP.init('imp14260610'); // 가맹점 식별코드

    const data = {
      pg: "kakaopay", // PG Provider
      pay_method: 'card',
      merchant_uid: orderNum.toString(),
      amount: '100', // 결제 금액
      name: 'InvestiGate 구독',
      buyer_name: '홍길동',
      buyer_tel: '010-1234-5678',
      buyer_email: 'example@example.com',
      buyer_addr: '서울특별시 강남구 삼성동',
      buyer_postcode: '123-456',
    };

    IMP.request_pay(data, callback);
  };

  // 결제 후 함수
  const callback = async(response) => {
    const { success, error_msg } = response;
    
    // 결제 성공 시 3페이지로 이동
    if (success) {
      await axios.put(`http://localhost:8080/subscribe2/${value.state.userNum}`, value.state.userNum);
      navigate('/subscribe3');
    } else {
      // 실패시 에러 문구 출력
      alert(`결제 실패: ${error_msg}`);
    }
  };

  // 결제하기 버튼 클릭 시
  const handleNextButtonClick = () => {

    // 주문번호 랜덤 생성
    setOrderNum(makeOrderNum());

    if (paymentMethod === 'kakaoPay') {
      kakaoPay();
    } else {
      cardPay();
    }
  };

  return (
    <div className='subscribe-container' style={{color:'#fff', marginBottom:'11%'}}>
      <div className='subscribe-img'>
        <ReportMoney size={50} />
      </div>
      <div className='subscribe-title'>
        <h4>결제</h4>
      </div>
      <FormControl component="fieldset" className='payment'>
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="creditCard"
            control={<Radio />}
            label="신용/체크카드"
            sx={{ color: '#fff' }}
          />
          <FormControlLabel
            value="kakaoPay"
            control={<Radio />}
            label="카카오페이"
            sx={{ color: '#fff' }}
          />
        </RadioGroup>
      </FormControl>
      <div>
      <Button
        className="subscribe-nextBtn"
        variant="contained"
        color="success"
        onClick={handleNextButtonClick}
        style={{ marginTop: '50px' }} 
      >
        결제하기
      </Button>
      </div>
    </div>
  );
};

export default Subscribe2;

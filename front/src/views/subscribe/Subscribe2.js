import React, { useState, useEffect } from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ReportMoney } from 'tabler-icons-react';

const Subscribe2 = () => {
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

  // script load
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
      alert('임포트 스크립트가 아직 로드되지 않았습니다.');
      return;
    }

    const { IMP } = window;
    IMP.init('imp14260610'); // 가맹점 식별코드

    const data = {
      pg: "uplus", // PG Provider
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

    IMP.request_pay(data, callbackMsg);
  };

  const callbackMsg = (response) => {
    const { success, error_msg } = response;
    if (success) {
      successSubscribe();
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  };

  // kakaopay 결제 시 출력
  const kakaoPay = () => {
    if (!impReady) {
      alert('임포트 스크립트가 아직 로드되지 않았습니다.');
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

  const navigate = useNavigate();

  const successSubscribe = () => {
    navigate('/subscribe3')
  }

  const callback = (response) => {
    const { success, error_msg } = response;
    if (success) {
      successSubscribe();
    } else {
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
    <div className='subscribe-container'>
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
          />
          <FormControlLabel
            value="kakaoPay"
            control={<Radio />}
            label="카카오페이"
          />
        </RadioGroup>
      </FormControl>
      <Button
        className="subscribe-nextBtn mgTop"
        variant="contained"
        color="success"
        onClick={handleNextButtonClick}
        style={{ marginTop: '50px' }} 
      >
        결제하기
      </Button>
    </div>
  );
};

export default Subscribe2;

import React, { useState } from 'react';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, FormLabel } from '@mui/material';
import './Subscribe.css';

function Subscribe2() {
  const [paymentMethod, setPaymentMethod] = useState('');

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <div className='subscribe-container'>
      <div className='subscribe-title'>
        <h4>결제</h4>
      </div>
      <FormControl component="fieldset" className='payment'>
        <RadioGroup
          aria-label="payment-method"
          name="payment-method"
          value={paymentMethod}
          onChange={handlePaymentChange}
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
      <Button className='subscribe-nextBtn' variant="contained" color="primary">다음</Button>
    </div>
  );
}

export default Subscribe2;
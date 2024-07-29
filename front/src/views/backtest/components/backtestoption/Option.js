import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';

const BacktestOptions = ({ onAnalyze }) => {
  const [stockCode, setStockCode] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [rebalancePeriod, setRebalancePeriod] = useState('monthly');

  const handleSubmit = () => {
    if (stockCode && startDate && endDate) {
      onAnalyze({
        stockCode,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        initialInvestment,
        rebalancePeriod
      });
    } else {
      alert('모든 필드를 채워주세요.');
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>백테스트 설정</Typography>
      
      <TextField
        fullWidth
        label="주식 코드"
        value={stockCode}
        onChange={(e) => setStockCode(e.target.value)}
        margin="normal"
      />
      
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        customInput={<TextField fullWidth label="시작 날짜" margin="normal" />}
      />
      
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        customInput={<TextField fullWidth label="종료 날짜" margin="normal" />}
      />
      
      <TextField
        fullWidth
        label="초기 투자 금액"
        type="number"
        value={initialInvestment}
        onChange={(e) => setInitialInvestment(Number(e.target.value))}
        margin="normal"
      />
      
      <FormControl fullWidth margin="normal">
        <InputLabel>리밸런싱 주기</InputLabel>
        <Select
          value={rebalancePeriod}
          onChange={(e) => setRebalancePeriod(e.target.value)}
        >
          <MenuItem value="monthly">매월</MenuItem>
          <MenuItem value="quarterly">분기</MenuItem>
          <MenuItem value="biannually">반기</MenuItem>
          <MenuItem value="annually">매년</MenuItem>
        </Select>
      </FormControl>
      
      <Button 
        variant="contained" 
        color="primary" 
        fullWidth 
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        분석 시작
      </Button>
    </Box>
  );
};

export default BacktestOptions;
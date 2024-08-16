import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import "./custom-datepicker.css";
import { TextField, Button, Select, MenuItem, FormControl, Box, Typography, useTheme, InputLabel } from '@mui/material';
import { useStock } from '../../../stock/components/context/StockContext';
import StockAutoSearch from '../stocksearch/StockAutoSearch';

const Options = ({ onAnalyze }) => {
  const [stockName, setStockName] = useState('');
  const [stockCode, setStockCode] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [initialInvestment, setInitialInvestment] = useState(1000000000);
  const [rebalancePeriod, setRebalancePeriod] = useState('monthly');
  const theme = useTheme();
  const { stockInfo } = useStock();

  useEffect(() => {
    if (stockInfo) {
      setStockName(stockInfo.stock_name);
      setStockCode(stockInfo.stock_code);
    }
  }, [stockInfo]);

  const handleStockSelect = (name, code) => {
    setStockName(name);
    setStockCode(code);
  };

  const handleSubmit = () => {
    if (stockCode && startDate && endDate) {
      onAnalyze({
        stockCode,
        stockName,
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
    <Box sx={{ p: 4, bgcolor: '#202637' }}>
    <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#fff' }}>
      백테스트 설정
    </Typography>

      <StockAutoSearch onStockSelect={handleStockSelect} />

      <TextField
        fullWidth
        label="선택된 주식 종목"
        value={stockName ? `${stockName} (${stockCode})` : ''}
        disabled
        margin="normal"
        variant="outlined"
        sx={{
          mb: 2,
          '& .MuiInputBase-input': {
            color: '#fff', // 입력 텍스트 색상
          },
          '& .MuiInputLabel-root': {
            color: '#fff', // 레이블 색상
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#fff', // 기본 테두리 색상
            },
            '&:hover fieldset': {
              borderColor: '#fff', // 호버 시 테두리 색상
            },
            '&.Mui-focused fieldset': {
              borderColor: '#fff', // 포커스 시 테두리 색상
            },
          },
        }}
        InputProps={{
          readOnly: true, // disabled와 동일하게 읽기 전용
        }}
        InputLabelProps={{
          style: { color: '#fff' }, // 레이블 색상
        }}
      />

      <DatePicker
        selected={startDate}
        locale={ko}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="custom-datepicker"
        popperClassName="custom-datepicker-popper"
        customInput={
          <TextField
            fullWidth
            label="시작 날짜"
            margin="normal"
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiInputBase-input': { color: '#FFFFFF' },
            }}
          />
        }
      />
      <DatePicker
        selected={endDate}
        locale={ko}
        onChange={(date) => setEndDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="custom-datepicker"
        popperClassName="custom-datepicker-popper"
        customInput={
          <TextField
            fullWidth
            label="시작 날짜"
            margin="normal"
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
              '& .MuiInputBase-input': { color: '#FFFFFF' },
            }}
          />
        }
      />
      <TextField
        fullWidth
        label="초기 투자 금액"
        type="number"
        value={initialInvestment}
        onChange={(e) => setInitialInvestment(Number(e.target.value))}
        margin="normal"
        variant="outlined"
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
          '& .MuiInputBase-input': { color: '#FFFFFF' },
        }}
      />

      <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 3 }}>
      <InputLabel sx={{ color: '#fff' }}>리밸런싱 주기</InputLabel>
        <Select
          value={rebalancePeriod}
          onChange={(e) => setRebalancePeriod(e.target.value)}
          label="리밸런싱 주기"
          sx={{ color: '#fff' }}
          MenuProps={{
            PaperProps: {
              style: {
                backgroundColor: '#333', // 기본 배경색
                color: '#fff', // 기본 텍스트 색상
              },
            },
          }}
        >
          <MenuItem
            value="monthly"
            sx={{
              '&:hover': {
                backgroundColor: '#555', // 마우스를 올렸을 때 배경색
              },
            }}
          >
            매월
          </MenuItem>
          <MenuItem
            value="quarterly"
            sx={{
              '&:hover': {
                backgroundColor: '#555', // 마우스를 올렸을 때 배경색
              },
            }}
          >
            분기
          </MenuItem>
          <MenuItem
            value="annually"
            sx={{
              '&:hover': {
                backgroundColor: '#555', // 마우스를 올렸을 때 배경색
              },
            }}
          >
            매년
          </MenuItem>
        </Select>
      </FormControl>
      
      <button className='btn btn-warning col-12'
        onClick={handleSubmit}
      >
        분석 시작
      </button>
    </Box>
  );
};

export default Options;

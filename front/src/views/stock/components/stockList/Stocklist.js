import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  useTheme
} from '@mui/material';

const Stocklist = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/stocks');
        setStocks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('주식 데이터 불러오기 오류:', err);
        setError('주식 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleStockSelect = (stock) => {
    onStockSelect(stock);
    navigate(`/stock/${stock.stock_code}`);
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;

  return (
    <TableContainer 
      component={Paper} 
      sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '0.4em'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,.1)'
        },
        '&:hover::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,.2)'
        },
        scrollbarWidth: 'thin',
        scrollbarColor: `rgba(0,0,0,.2) transparent`,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>종목명</TableCell>
            <TableCell sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>종목코드</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>고가</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>저가</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>종가</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>날짜</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText, fontWeight: 'bold' }}>유형</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stocks.map((stock) => (
            <TableRow
              key={`${stock.stock_code}-${stock.record_date}`}
              onClick={() => handleStockSelect(stock)}
              hover
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>{stock.name}</TableCell>
              <TableCell>{stock.stock_code}</TableCell>
              <TableCell align="right">{stock.high_price?.toLocaleString()}</TableCell>
              <TableCell align="right">{stock.low_price?.toLocaleString()}</TableCell>
              <TableCell align="right">{stock.closing_price?.toLocaleString()}</TableCell>
              <TableCell align="right">{stock.record_date}</TableCell>
              <TableCell align="right">{stock.stock_type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Stocklist;
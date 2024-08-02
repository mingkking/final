import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  useTheme,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Stocklist = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastLoadedId, setLastLoadedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const observer = useRef();
  const navigate = useNavigate();
  const theme = useTheme();

  const lastStockElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreStocks();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const fetchStocks = async (url, isInitialLoad = false) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setStocks(prevStocks => isInitialLoad ? response.data.stocks : [...prevStocks, ...response.data.stocks]);
      setHasMore(response.data.hasMore);
      setLastLoadedId(response.data.lastLoadedId);
      setLoading(false);
    } catch (err) {
      console.error('주식 데이터 불러오기 오류:', err);
      setError('주식 데이터를 불러오는 데 실패했습니다.');
      setLoading(false);
    }
  };

  useEffect(() => {
    setStocks([]);
    setLastLoadedId(null);
    setHasMore(true);
    fetchStocks(`http://localhost:8080/stock/search?query=${searchTerm}&page=0&size=15`, true);
  }, [searchTerm]);

  const loadMoreStocks = () => {
    if (hasMore && !loading) {
      fetchStocks(`http://localhost:8080/stock/search?query=${searchTerm}&lastId=${lastLoadedId}&size=15`);
    }
  };

  const handleStockSelect = (stock) => {
    onStockSelect(stock);
    navigate(`/stock/${stock.stock_code}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="종목명 또는 종목코드로 검색"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TableContainer 
        component={Paper} 
        sx={{ 
          flexGrow: 1,
          height: 'calc(100vh - 180px)', // 검색 필드 공간 고려
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
            {stocks.map((stock, index) => (
              <TableRow
                key={`${stock.stock_code}-${stock.record_date}`}
                onClick={() => handleStockSelect(stock)}
                hover
                ref={stocks.length === index + 1 ? lastStockElementRef : null}
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
    </Box>
  );
};

export default Stocklist;
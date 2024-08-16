import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
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
  Typography,
  Box,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CommunityContext from "../../../community/contexts/CommunityContext";

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const communityValue = useContext(CommunityContext);

  const fetchStocks = useCallback(async (url, isInitialLoad = false) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      if (communityValue.state.userNum) 
        setStocks(prevStocks => isInitialLoad ? response.data.stocks : [...prevStocks, ...response.data.stocks]);
      setHasMore(response.data.hasMore);
      setLastLoadedId(response.data.lastLoadedId);
      setLoading(false);
    } catch (err) {
      console.error('주식 데이터 불러오기 오류:', err);
      setError('주식 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setLoading(false);
    }
  }, [communityValue.state.userNum]);

  const loadMoreStocks = useCallback(() => {
    if (hasMore && !loading) {
      fetchStocks(`http://localhost:8080/stock/search?query=${searchTerm}&lastId=${lastLoadedId}&size=15`);
    }
  }, [hasMore, loading, searchTerm, lastLoadedId, fetchStocks]);

  const lastStockElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreStocks();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreStocks]);

  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    fetchStocks(`http://localhost:8080/stock/search?query=${searchTerm}&page=0&size=15`, true);
  }, [fetchStocks, searchTerm]);

  // 검색어 변경 시 데이터 다시 불러오기
  useEffect(() => {
    setStocks([]);
    setLastLoadedId(null);
    setHasMore(true);
    fetchStocks(`http://localhost:8080/stock/search?query=${searchTerm}&page=0&size=15`, true);
  }, [searchTerm, fetchStocks]);

  const handleStockSelect = (stock) => {
    onStockSelect(stock);
    navigate(`/stock/${stock.stock_code}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ width: '100%', maxWidth: '100vw', overflow: 'hidden', backgroundColor:'#282E3C' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="종목명 또는 종목코드로 검색"
        value={searchTerm}
        onChange={handleSearch}
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
              borderColor: theme.palette.primary.dark,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '& input::placeholder': {
              color: '#FFFFFF', // Placeholder 텍스트 색상을 흰색으로 변경
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton>
                <SearchIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TableContainer
        component={Paper}
        sx={{
          height: 'calc(100vh - 200px)',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
            scrollbarWidth: 'none',  
            msOverflowStyle: 'none',  
            '&::-webkit-scrollbar': {
              display: 'none',  
            },
          },
          '&::-webkit-scrollbar-track': {
            background: theme.palette.background.default,
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme.palette.primary.main,
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme.palette.primary.dark,
          },
          scrollbarWidth: 'thin',
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {['종목명', '종목코드', '고가', '저가', '종가', '날짜', '유형'].map((header, index) => (
                <TableCell
                  key={index}
                  align={index > 1 ? "right" : "left"}
                  sx={{
                    backgroundColor: '#202636',
                    color: theme.palette.primary.contrastText,
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    padding: isMobile ? '8px 4px' : '16px',
                  }}
                >
                  {header}
                </TableCell>
              ))}
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
                    backgroundColor: '#282E3C',
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: '#282E3C',
                  },
                }}
              >
                <TableCell sx={{ fontWeight: "bold", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? '100px' : '200px' }}>{stock.stock_name}</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{stock.stock_code}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{stock.high_price?.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{stock.low_price?.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{stock.closing_price?.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", display: isMobile ? 'none' : 'table-cell' }}>{stock.record_date}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", display: isMobile ? 'none' : 'table-cell' }}>{stock.stock_type}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Stocklist;
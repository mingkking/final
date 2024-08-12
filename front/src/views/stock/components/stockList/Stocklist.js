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
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import CommunityContext from "../../../community/contexts/CommunityContext";
import axiosInstance from "../../../login/component/Token/axiosInstance";

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

  const loginCheck = async () => {
    try {
      const response = await axiosInstance.get('/check-login-status', {
        withCredentials: true,
      });

      if (response.data.isLoggedIn !== true) {
        alert("로그인 및 구독 후 이용해주세요!");
        navigate("/login");
      } else {
        communityValue.actions.setUserNick(response.data.userNickname);
        communityValue.actions.setUserNum(response.data.userNum);
        return true;  // 로그인 상태일 때 true 반환
      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      alert("로그인 상태를 확인하는 중 오류가 발생했습니다.");
      return false;
    }
  };
  const handleToggleFavorite = async (event, stock) => {
    event.stopPropagation();
    if (await loginCheck()) {
      try {
        const endpoint = stock.isFavorite ? 'delete_stock' : 'add_stock';
        const response = await axios.post(`http://localhost:5000/${endpoint}`, {
          user_num: communityValue.state.userNum,
          stock_code: stock.stock_code
        });
        
        if (response.data.status === 'success') {
          setStocks(stocks.map(s =>
            s.stock_code === stock.stock_code
              ? { ...s, isFavorite: !s.isFavorite }
              : s
          ));
          console.log(response.data.message);
        } else {
          console.error('관심 종목 토글 실패:', response.data.message);
        }
      } catch (error) {
        console.error('관심 종목 토글 중 오류 발생:', error);
      }
    }
  };

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
      if (communityValue.state.userNum) {
        const stocksWithFavorites = await Promise.all(response.data.stocks.map(async (stock) => {
          try {
            const favoriteResponse = await axios.post('http://localhost:5000/check_stock', {
              user_num: communityValue.state.userNum,
              stock_code: stock.stock_code
            });
            return { ...stock, isFavorite: favoriteResponse.data.isFavorite };
          } catch (error) {
            console.error('관심 종목 확인 중 오류:', error);
            return { ...stock, isFavorite: false };
          }
        }));
        setStocks(prevStocks => isInitialLoad ? stocksWithFavorites : [...prevStocks, ...stocksWithFavorites]);
      } else {
        setStocks(prevStocks => isInitialLoad ? response.data.stocks : [...prevStocks, ...response.data.stocks]);
      }
      setHasMore(response.data.hasMore);
      setLastLoadedId(response.data.lastLoadedId);
      setLoading(false);
    } catch (err) {
      console.error('주식 데이터 불러오기 오류:', err);
      setError('주식 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
      setLoading(false);
    }
  };

useEffect(() => {
  setStocks([]);
  setLastLoadedId(null);
  setHasMore(true);
  fetchStocks(`http://localhost:8080/stock/search?query=${searchTerm}&page=0&size=15`, true);
}, [searchTerm, communityValue.state.userNum]);

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
    <Box sx={{ width: '100%', maxWidth: '100vw', overflow: 'hidden' }}>
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
              {['종목명', '종목코드', '고가', '저가', '종가', '날짜', '유형', ''].map((header, index) => (
                <TableCell
                  key={index}
                  align={index > 1 ? "right" : "left"}
                  sx={{
                    backgroundColor: theme.palette.primary.main,
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
                    backgroundColor: theme.palette.action.hover,
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: theme.palette.action.hover,
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
                <TableCell padding="checkbox">
                  <IconButton onClick={(e) => handleToggleFavorite(e, stock)} size="small">
                    {stock.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Stocklist;
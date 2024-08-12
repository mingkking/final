import React, { useEffect, useRef, useState,useContext } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useStock  } from "../context/StockContext";
import axios from 'axios';
import { createChart, CrosshairMode } from 'lightweight-charts';
import {
  Typography,
  Grid,
  Box,
  CircularProgress,
  useTheme,
  Divider,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Tooltip,
  useMediaQuery,
  Card
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import Addchart from '@mui/icons-material/Addchart';
import axiosInstance from "../../../login/component/Token/axiosInstance"
import CommunityContext from "../../../community/contexts/CommunityContext"
const StockDetail = () => {
  const { stockCode } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [indicators, setIndicators] = useState(['MA']);
  const candleChartRef = useRef();
  const volumeChartRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const communityValue = useContext(CommunityContext);
  const navigate = useNavigate();
  const upColor = '#26A69A';
  const downColor = '#EF5350';
  const { setStockInfo } = useStock();
  //주식상세 정보
  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/stock/${stockCode}`);
        setStockData(response.data);
        setStockInfo(response.data.stockInfo);
        setLoading(false);
      } catch (err) {
        console.error('주식 상세 데이터 불러오기 오류:', err);
        setError('주식 상세 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [stockCode,setStockInfo]);

  // 백테스트 페이지로 이동
  const handleAddToBacktest = () => {
    navigate('/back1');
  };
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
  
  //해당 종목에 관심 등록
  const handleToggleFavorite = async () => {
    if (await loginCheck()) {
     try {
      const endpoint = isFavorite ? 'delete_stock' : 'add_stock';
      const response = await axios.post(`http://localhost:5000/${endpoint}`,{
        user_num:communityValue.state.userNum,
        stock_code:stockCode,
      });
      if(response.data.status === 'success'){
        setIsFavorite(!isFavorite);
      }else{
        console.log("실패: ",response.data.message);
      }
     } catch (error) {
      console.log("에러 발생",error);
     }
    }
  };
  //차트를 출력을 할때 해당 되는 데이터들을 출력 및 주식 지표들을 출력하기 위한 계산
  useEffect(() => {
    if (stockData && candleChartRef.current && volumeChartRef.current) {
      const chartWidth = candleChartRef.current.clientWidth;
      const candleChartHeight = isMobile ? 300 : 400;
      const volumeChartHeight = isMobile ? 100 : 150;

      const candleChart = createChart(candleChartRef.current, {
        width: chartWidth,
        height: candleChartHeight,
        layout: {
          backgroundColor: '#ffffff',
          textColor: theme.palette.text.primary,
        },
        grid: {
          vertLines: { color: theme.palette.divider },
          horzLines: { color: theme.palette.divider },
        },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: theme.palette.divider },
        timeScale: { borderColor: theme.palette.divider, timeVisible: true, secondsVisible: false },
      });

      const volumeChart = createChart(volumeChartRef.current, {
        width: chartWidth,
        height: volumeChartHeight,
        layout: {
          backgroundColor: '#ffffff',
          textColor: theme.palette.text.primary,
        },
        grid: {
          vertLines: { color: theme.palette.divider },
          horzLines: { color: theme.palette.divider },
        },
        crosshair: { mode: CrosshairMode.Normal },
        rightPriceScale: { borderColor: theme.palette.divider },
        timeScale: { borderColor: theme.palette.divider, timeVisible: true, secondsVisible: false },
      });

      const candleSeries = candleChart.addCandlestickSeries({
        upColor: upColor,
        downColor: downColor,
        borderVisible: false,
        wickUpColor: upColor,
        wickDownColor: downColor,
      });

      const volumeSeries = volumeChart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: '',
      });

      const mappedData = stockData.priceHistory
        .filter(item => item.opening_price !== null && item.high_price !== null && item.low_price !== null && item.closing_price !== null)
        .map(item => ({
          time: item.record_date.split(' ')[0],
          open: item.opening_price,
          high: item.high_price,
          low: item.low_price,
          close: item.closing_price,
          volume: item.trading_volume,
        }));

      //해당 종목에 캔들 차트 형식으로 출력
      candleSeries.setData(mappedData);
      // 해당 종목에 거래량 차트 출력
      volumeSeries.setData(mappedData.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? upColor : downColor,
      })));

      if (indicators.includes('MA')) {
        const ma20 = candleChart.addLineSeries({
          color: 'rgba(255, 192, 0, 1)',
          lineWidth: 2,
        });

        const ma20Data = calculateMA(mappedData, 20);
        ma20.setData(ma20Data);
      }

      if (indicators.includes('RSI')) {
        const rsiSeries = candleChart.addLineSeries({
          color: 'rgba(0, 120, 255, 1)',
          lineWidth: 2,
          priceScaleId: 'right',
        });

        const rsiData = calculateRSI(mappedData);
        rsiSeries.setData(rsiData);
      }

      if (indicators.includes('MACD')) {
        const macdSeries = candleChart.addLineSeries({
          color: 'rgba(255, 0, 0, 1)',
          lineWidth: 2,
          priceScaleId: 'right',
        });
        const signalSeries = candleChart.addLineSeries({
          color: 'rgba(0, 255, 0, 1)',
          lineWidth: 2,
          priceScaleId: 'right',
        });
        const histogramSeries = candleChart.addHistogramSeries({
          color: 'rgba(128, 128, 128, 0.5)',
          priceScaleId: 'right',
        });

        const macdData = calculateMACD(mappedData);
        macdSeries.setData(macdData.map(d => ({ time: d.time, value: d.macd })));
        signalSeries.setData(macdData.map(d => ({ time: d.time, value: d.signal })));
        histogramSeries.setData(macdData.map(d => ({ time: d.time, value: d.histogram })));
      }

      candleChart.timeScale().fitContent();
      volumeChart.timeScale().fitContent();

      candleChart.timeScale().subscribeVisibleTimeRangeChange(() => {
        const timeRange = candleChart.timeScale().getVisibleRange();
        volumeChart.timeScale().setVisibleRange(timeRange);
      });

      volumeChart.timeScale().subscribeVisibleTimeRangeChange(() => {
        const timeRange = volumeChart.timeScale().getVisibleRange();
        candleChart.timeScale().setVisibleRange(timeRange);
      });

      return () => {
        candleChart.remove();
        volumeChart.remove();
      };
    }
  }, [stockData, theme, upColor, downColor, indicators, isMobile]);

  // 해당 종목에 여러가지 주식 지표들을 계산 하는 함수들
  // MA 이동 평균 계산
  const calculateMA = (data, period) => {
    const result = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
      result.push({
        time: data[i].time,
        value: sum / period,
      });
    }
    return result;
  };
  // RSI 상대적 강도 지수 계산
  const calculateRSI = (data, period = 14) => {
    const rsiData = [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i < data.length; i++) {
      const difference = data[i].close - data[i - 1].close;
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }

      if (i >= period) {
        if (i > period) {
          gains = (gains * (period - 1) + (difference > 0 ? difference : 0)) / period;
          losses = (losses * (period - 1) + (difference < 0 ? -difference : 0)) / period;
        }

        const relativeStrength = gains / losses;
        const rsi = 100 - (100 / (1 + relativeStrength));

        rsiData.push({
          time: data[i].time,
          value: rsi
        });
      }
    }

    return rsiData;
  };
  // MACD 계산 이동 편균선
  const calculateMACD = (data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
    const macdData = [];
    let shortEMA = 0;
    let longEMA = 0;
    let signal = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        shortEMA = data[i].close;
        longEMA = data[i].close;
      } else {
        shortEMA = (data[i].close - shortEMA) * (2 / (shortPeriod + 1)) + shortEMA;
        longEMA = (data[i].close - longEMA) * (2 / (longPeriod + 1)) + longEMA;
      }

      const macd = shortEMA - longEMA;

      if (i >= longPeriod - 1) {
        if (i === longPeriod - 1) {
          signal = macd;
        } else {
          signal = (macd - signal) * (2 / (signalPeriod + 1)) + signal;
        }

        macdData.push({
          time: data[i].time,
          macd: macd,
          signal: signal,
          histogram: macd - signal
        });
      }
    }
    return macdData;
  };

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" p={2}>{error}</Typography>;
  if (!stockData) return <Typography align="center" p={2}>데이터가 없습니다.</Typography>;

  const latestData = stockData.stockInfo;

  return (
    <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1, sm: 2 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant={isMobile ? "h4" : "h3"} component="h1" align='left' sx={{ fontWeight: 'bold' }}>
              {latestData.stock_name} ({latestData.stock_code})
            </Typography>
            <Typography variant="body1" sx={{fontWeight:"bold"}} color="text.secondary">
              {latestData.record_date} 기준 | {latestData.stock_type}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="백테스트 하러 가기">
            <IconButton size="small" onClick={handleAddToBacktest}>
              <Addchart />
            </IconButton>
          </Tooltip>
          <Tooltip title={isFavorite ? "관심종목에서 제거" : "관심종목에 추가"}>
            <IconButton size="small" onClick={handleToggleFavorite}>
              {isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
            </IconButton>
          </Tooltip>
        </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant={isMobile ? "h3" : "h2"} component="p" color={latestData.compared_price >= 0 ? upColor : downColor} sx={{ fontWeight: 'bold' }}>
            {latestData.closing_price?.toLocaleString()} 원
          </Typography>
          <Typography variant="body1" component="span" color={latestData.compared_price >= 0 ? upColor : downColor}>
            {latestData.compared_price >= 0 ? '+' : ''}{latestData.compared_price} ({(latestData.compared_price / (latestData.closing_price - latestData.compared_price) * 100).toFixed(2)}%)
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <FormControl size="small" fullWidth>
            <InputLabel id="indicator-select-label">지표</InputLabel>
            <Select
              labelId="indicator-select-label"
              id="indicator-select"
              multiple
              value={indicators}
              label="지표"
              onChange={(e) => setIndicators(e.target.value)}
            >
              <MenuItem value="MA">이동평균선</MenuItem>
              <MenuItem value="RSI">RSI</MenuItem>
              <MenuItem value="MACD">MACD</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box ref={candleChartRef} sx={{ width: '100%', height: isMobile ? 300 : 400, mb: 2 }} />
        <Box ref={volumeChartRef} sx={{ width: '100%', height: isMobile ? 100 : 150, mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>주가 정보</Typography>
            <Grid container spacing={1}>
              {[
                { label: '시가', value: latestData.opening_price },
                { label: '고가', value: latestData.high_price },
                { label: '저가', value: latestData.low_price },
                { label: '종가', value: latestData.closing_price }
              ].map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body2" color="text.secondary" sx={{fontWeight:"bold"}}>{item.label}</Typography>
                  <Typography variant="body2" sx={{fontWeight:"bold"}}>{item.value?.toLocaleString()} 원</Typography>
                </Grid>
              ))}
            </Grid>

          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>거래 정보</Typography>
            <Grid container spacing={1}>
              {[
                { label: '거래량', value: latestData.trading_volume, unit: '' },
                { label: '거래대금', value: latestData.trading_amount, unit: '원' },
                { label: '시가총액', value: latestData.capitalization, unit: '원' },
                { label: '상장주식수', value: latestData.listed_stocks, unit: '' }
              ].map((item, index) => (
                <Grid item xs={6} key={index}>
                  <Typography variant="body2" color="text.secondary" sx={{fontWeight:"bold"}}>{item.label}</Typography>
                  <Typography variant="body2" sx={{fontWeight:"bold"}}>{item.value?.toLocaleString()} {item.unit} </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StockDetail;
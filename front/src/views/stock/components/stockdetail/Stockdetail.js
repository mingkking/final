
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import {
  Card,
  CardContent,
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
  useMediaQuery
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const StockDetail = () => {
  const { stockCode } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeframe, setTimeframe] = useState('1D');
  const [indicators, setIndicators] = useState(['MA']);
  const priceChartRef = useRef();
  const volumeChartRef = useRef();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const upColor = '#26A69A';
  const downColor = '#EF5350';

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/stock/${stockCode}`);
        setStockData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('주식 상세 데이터 불러오기 오류:', err);
        setError('주식 상세 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchStockDetail();
  }, [stockCode]);
  //RSI 지수 계산
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
  //MACD 지수 계산
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

  useEffect(() => {
    if (stockData && priceChartRef.current && volumeChartRef.current) {
      const chartWidth = isMobile ? priceChartRef.current.clientWidth : priceChartRef.current.clientWidth;
      const priceChartHeight = isMobile ? 300 : 400;
      const volumeChartHeight = isMobile ? 100 : 150;

      const priceChart = createChart(priceChartRef.current, {
        width: chartWidth,
        height: priceChartHeight,
        layout: {
          backgroundColor: '#ffffff',
          textColor: theme.palette.text.primary,
        },
        grid: {
          vertLines: { color: theme.palette.divider },
          horzLines: { color: theme.palette.divider },
        },
        crosshair: { mode: 'normal' },
        rightPriceScale: { borderColor: theme.palette.divider },
        timeScale: { borderColor: theme.palette.divider, timeVisible: true, secondsVisible: false },
      });
      //주식 차트 생성
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
        rightPriceScale: { borderColor: theme.palette.divider },
        timeScale: { borderColor: theme.palette.divider, timeVisible: true, secondsVisible: false },
      });

      const candleSeries = priceChart.addCandlestickSeries({
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

      candleSeries.setData(mappedData);
      volumeSeries.setData(mappedData.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? upColor : downColor,
      })));

      if (indicators.includes('MA')) {
        const ma20 = priceChart.addLineSeries({
          color: 'rgba(255, 192, 0, 1)',
          lineWidth: 2,
        });

        const ma20Data = calculateMA(mappedData, 20);
        ma20.setData(ma20Data);
      }

      if (indicators.includes('RSI')) {
        const rsiSeries = priceChart.addLineSeries({
          color: 'rgba(0, 120, 255, 1)',
          lineWidth: 2,
          pane: 1,
        });

        const rsiData = calculateRSI(mappedData);
        rsiSeries.setData(rsiData);
      }

      if (indicators.includes('MACD')) {
        const macdSeries = priceChart.addLineSeries({
          color: 'rgba(255, 0, 0, 1)',
          lineWidth: 2,
          pane: 2,
        });

        const signalSeries = priceChart.addLineSeries({
          color: 'rgba(0, 255, 0, 1)',
          lineWidth: 2,
          pane: 2,
        });

        const histogramSeries = priceChart.addHistogramSeries({
          color: 'rgba(128, 128, 128, 0.5)',
          pane: 2,
        });

        const macdData = calculateMACD(mappedData);
        macdSeries.setData(macdData.map(d => ({ time: d.time, value: d.macd })));
        signalSeries.setData(macdData.map(d => ({ time: d.time, value: d.signal })));
        histogramSeries.setData(macdData.map(d => ({ time: d.time, value: d.histogram })));
      }

      priceChart.timeScale().fitContent();
      volumeChart.timeScale().fitContent();

      return () => {
        priceChart.remove();
        volumeChart.remove();
      };
    }

  }, [stockData, theme, upColor, downColor, timeframe, indicators, isMobile]);

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

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress size={60} /></Box>;
  if (error) return <Typography color="error" align="center" p={4}>{error}</Typography>;
  if (!stockData) return <Typography align="center" p={4}>데이터가 없습니다.</Typography>;

  const latestData = stockData.stockInfo;

  return (
    <Container maxWidth="lg" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2 }}>
          <Box>
            <Typography variant={isMobile ? "h5" : "h4"} component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {latestData.stock_name} ({latestData.stock_code})
            </Typography>
            <Typography variant={isMobile ? "body2" : "subtitle1"} color="text.secondary">
              {latestData.record_date} 기준 | {latestData.stock_type}
            </Typography>
          </Box>
          <Tooltip title={isFavorite ? "관심종목에서 제거" : "관심종목에 추가"}>
            <IconButton
              onClick={() => setIsFavorite(!isFavorite)}
              aria-label="관심종목 등록"
              sx={{ fontSize: isMobile ? '1.5rem' : '2rem', mt: { xs: 1, sm: 0 } }}
            >
              {isFavorite ? <StarIcon fontSize="inherit" color="primary" /> : <StarBorderIcon fontSize="inherit" />}
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'baseline' }, mb: 3 }}>
          <Typography variant={isMobile ? "h4" : "h3"} component="p" color={latestData.compared_price >= 0 ? upColor : downColor} sx={{ fontWeight: 'bold', mb: { xs: 1, sm: 0 } }}>
            {latestData.closing_price?.toLocaleString()} 원
          </Typography>
          <Typography variant={isMobile ? "h6" : "h5"} component="span" color={latestData.compared_price >= 0 ? upColor : downColor}>
            {latestData.compared_price >= 0 ? '+' : ''}{latestData.compared_price} ({(latestData.compared_price / (latestData.closing_price - latestData.compared_price) * 100).toFixed(2)}%)
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mb: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
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

        <Box ref={priceChartRef} sx={{ width: '100%', height: isMobile ? 300 : 400, mb: 2 }} />
        <Box ref={volumeChartRef} sx={{ width: '100%', height: isMobile ? 100 : 150, mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>주가 정보</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: '시가', value: latestData.opening_price },
                    { label: '고가', value: latestData.high_price },
                    { label: '저가', value: latestData.low_price },
                    { label: '종가', value: latestData.closing_price }
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontWeight: 'medium' }}>{item.value?.toLocaleString()} 원</Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>거래 정보</Typography>
                <Grid container spacing={2}>
                  {[
                    { label: '거래량', value: latestData.trading_volume, unit: '' },
                    { label: '거래대금', value: latestData.trading_amount, unit: '원' },
                    { label: '시가총액', value: latestData.capitalization, unit: '원' },
                    { label: '상장주식수', value: latestData.listed_stocks, unit: '' }
                  ].map((item, index) => (
                    <Grid item xs={6} key={index}>
                      <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                      <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontWeight: 'medium' }}>{item.value?.toLocaleString()} {item.unit}</Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default StockDetail;
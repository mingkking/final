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
  useTheme
} from '@mui/material';

const StockDetail = () => {
  const { stockCode } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef();
  const theme = useTheme();

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

  useEffect(() => {
    if (stockData && chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          backgroundColor: '#ffffff',
          textColor: theme.palette.text.primary,
        },
        grid: {
          vertLines: {
            color: theme.palette.divider,
          },
          horzLines: {
            color: theme.palette.divider,
          },
        },
        crosshair: {
          mode: 'normal',
        },
        priceScale: {
          borderColor: theme.palette.divider,
        },
        timeScale: {
          borderColor: theme.palette.divider,
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: theme.palette.success.main,
        downColor: theme.palette.error.main,
        borderVisible: false,
        wickUpColor: theme.palette.success.main,
        wickDownColor: theme.palette.error.main,
      });

      const mappedData = stockData.priceHistory
        .filter(item => item.opening_price !== null && item.high_price !== null && item.low_price !== null && item.closing_price !== null)
        .map(item => ({
          time: item.record_date.split(' ')[0],
          open: item.opening_price,
          high: item.high_price,
          low: item.low_price,
          close: item.closing_price,
        }));

      candleSeries.setData(mappedData);
      chart.timeScale().fitContent();

      return () => {
        chart.remove();
      };
    }
  }, [stockData, theme]);

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" p={4}>{error}</Typography>;
  if (!stockData) return <Typography align="center" p={4}>데이터가 없습니다.</Typography>;

  const latestData = stockData.stockInfo;

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', py: 3 }}>
      <Card elevation={3} sx={{ maxWidth: 800, margin: 'auto' }}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {latestData.stock_name} ({latestData.stock_code})
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">종가: {latestData.closing_price?.toLocaleString()} 원</Typography>
              <Typography variant="body1">시가: {latestData.opening_price?.toLocaleString()} 원</Typography>
              <Typography variant="body1">고가: {latestData.high_price?.toLocaleString()} 원</Typography>
              <Typography variant="body1">저가: {latestData.low_price?.toLocaleString()} 원</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div>관심등록</div>
              <Typography variant="body1">날짜: {latestData.record_date}</Typography>
              <Typography variant="body1">유형: {latestData.stock_type}</Typography>
            </Grid>
          </Grid>
          <Box ref={chartContainerRef} sx={{ width: '100%', height: 400 }} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default StockDetail;
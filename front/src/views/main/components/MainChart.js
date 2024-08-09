import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Box, Typography, CircularProgress } from '@mui/material';

function MainChart() {
    const [stockData, setStockData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const priceChartRef = useRef();

    useEffect(() => {
        const fetchStock = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/MainStock");
                // console.log("Raw server response:", response.data); 
                setStockData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching stocks", error);
                setError("주식 데이터를 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };
        fetchStock();
    }, []);

    useEffect(() => {
        if (stockData && priceChartRef.current) {
            const priceChart = createChart(priceChartRef.current, {
                width: 510,
                height: 450, // 높이를 400에서 500으로 증가
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#333',
                },
                grid: {
                    vertLines: { color: 'rgba(197, 203, 206, 0.3)' },
                    horzLines: { color: 'rgba(197, 203, 206, 0.3)' },
                },
                crosshair: {
                    mode: 'normal',
                    vertLine: { width: 1, color: 'rgba(224, 227, 235, 0.6)', style: 0 },
                    horzLine: { width: 1, color: 'rgba(224, 227, 235, 0.6)', style: 0 },
                },
                rightPriceScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    ticksVisible: true,
                    scaleMargins: {
                        top: 0.1,
                        bottom: 0.1,
                    },
                },
                timeScale: {
                    borderColor: 'rgba(197, 203, 206, 0.8)',
                    timeVisible: true,
                    secondsVisible: false,
                },
            });
    
            const candleSeries = priceChart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            const mappedData = stockData.priceHistory
                .filter(item => 
                    item.opening_price !== null && 
                    item.high_price !== null && 
                    item.low_price !== null && 
                    item.closing_price !== null
                )
                .map(item => ({
                    time: item.record_date.split(' ')[0],
                    open: Number(item.opening_price),
                    high: Number(item.high_price),
                    low: Number(item.low_price),
                    close: Number(item.closing_price),
                }));

            console.log("Mapped Data:", mappedData); // 데이터 로깅

            try {
                candleSeries.setData(mappedData);
            } catch (error) {
                console.error("Error setting chart data:", error);
                setError("차트 데이터 설정 중 오류가 발생했습니다.");
            }
            priceChart.applyOptions({
                watermark: {
                    visible: true,
                    fontSize: 40,
                    horzAlign: 'center',
                    vertAlign: 'center',
                    color: 'rgba(171, 71, 188, 0.3)',
                },
            });
    
            priceChart.timeScale().fitContent();

            return () => {
                priceChart.remove();
            };
        }
    }, [stockData]);

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress size={60} /></Box>;
    if (error) return <Typography color="error" align="center" p={4}>{error}</Typography>;
    if (!stockData) return <Typography align="center" p={4}>데이터가 없습니다.</Typography>;

    return (
            <Box sx={{ width: '100%', p: 3, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>삼성전자 주식 차트</Typography>
                <Box ref={priceChartRef} sx={{ width: '100%', height: 500, backgroundColor: 'white', borderRadius: 1, boxShadow: 1 }} />
            </Box>
    );
}

export default MainChart;
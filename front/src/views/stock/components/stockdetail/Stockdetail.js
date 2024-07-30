// views/stock/StockDetail.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { createChart } from 'lightweight-charts';

const StockDetail = () => {
  const { stockCode } = useParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartContainerRef = useRef();

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
          textColor: 'rgba(33, 56, 77, 1)',
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
        },
        crosshair: {
          mode: 'normal',
        },
        priceScale: {
          borderColor: 'rgba(197, 203, 206, 1)',
        },
        timeScale: {
          borderColor: 'rgba(197, 203, 206, 1)',
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      const mappedData = stockData.priceHistory
        .filter(item => item.opening_price !== null && item.high_price !== null && item.low_price !== null && item.closing_price !== null)
        .map(item => ({
          time: item.record_date.split(' ')[0], // 'YYYY-MM-DD' 형식만 사용
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
  }, [stockData]);

  if (loading) return <div className="text-center p-4">로딩 중...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;
  if (!stockData) return <div className="text-center p-4">데이터가 없습니다.</div>;

  const latestData = stockData.stockInfo;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{latestData.name} ({latestData.stock_code})</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p>종가: {latestData.closing_price?.toLocaleString()} 원</p>
          <p>시가: {latestData.opening_price?.toLocaleString()} 원</p>
          <p>고가: {latestData.high_price?.toLocaleString()} 원</p>
          <p>저가: {latestData.low_price?.toLocaleString()} 원</p>
        </div>
        <div>
          <p>날짜: {latestData.record_date}</p>
          <p>유형: {latestData.stock_type}</p>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default StockDetail;
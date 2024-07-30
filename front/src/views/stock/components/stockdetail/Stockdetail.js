import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createChart, CrosshairMode } from 'lightweight-charts';
import axios from 'axios';

const StockDetail = () => {
  const { stockCode } = useParams();
  const chartContainerRef = useRef();
  const chart = useRef(null);
  const candleSeries = useRef(null);
  const [timeRange, setTimeRange] = useState('1D');
  const [stockData, setStockData] = useState({
    name: '',
    current: 0,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initChart = () => {
      if (chartContainerRef.current && !chart.current) {
        chart.current = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: {
            background: { type: 'solid', color: 'black' },
            textColor: 'white',
          },
          grid: {
            vertLines: { color: 'rgba(70, 70, 70, 0.5)' },
            horzLines: { color: 'rgba(70, 70, 70, 0.5)' },
          },
          crosshair: {
            mode: CrosshairMode.Normal,
          },
          priceScale: {
            borderColor: 'rgba(100, 100, 100, 0.8)',
          },
          timeScale: {
            borderColor: 'rgba(100, 100, 100, 0.8)',
          },
        });

        candleSeries.current = chart.current.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/stocks/${stockCode}?range=${timeRange}`);
        const { stockInfo, priceHistory } = response.data;
        
        setStockData({
          name: stockInfo.name,
          current: stockInfo.closing_price,
          open: stockInfo.opening_price,
          high: stockInfo.high_price,
          low: stockInfo.low_price,
          close: stockInfo.closing_price,
        });

        if (candleSeries.current) {
          candleSeries.current.setData(priceHistory.map(price => ({
            time: price.record_date,
            open: price.opening_price,
            high: price.high_price,
            low: price.low_price,
            close: price.closing_price
          })));
        }
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error('Error fetching stock data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initChart();
    fetchData();

    const handleResize = () => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chart.current) {
        chart.current.remove();
      }
    };
  }, [stockCode, timeRange]);

  const changeTimeRange = (range) => {
    setTimeRange(range);
  };

  if (isLoading) return <div className="text-white">로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-black text-white p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeTimeRange('1D')}>1일</button>
        <button onClick={() => changeTimeRange('1W')}>1주</button>
        <button onClick={() => changeTimeRange('1M')}>1개월</button>
        <button onClick={() => changeTimeRange('1Y')}>1년</button>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">—</span>
          <span>{stockData.name}</span>
          <input type="text" value={`${stockData.current.toLocaleString()}`} className="bg-black border-b border-gray-600 w-24 text-right" readOnly />
          <span>KRW</span>
        </div>
      </div>
      
      <div className="text-sm mb-2">
        <span>시 {stockData.open.toLocaleString()} 고 {stockData.high.toLocaleString()} 저 {stockData.low.toLocaleString()} 종 {stockData.close.toLocaleString()}</span>
      </div>
      
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
};

export default StockDetail;
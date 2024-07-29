import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
// import { Settings, X } from 'lucide-react';
import axios from 'axios';

const StockDetail = ({ stockSymbol }) => {
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();
  const [timeRange, setTimeRange] = useState('1D');
  const [stockData, setStockData] = useState({
    current: 0,
    open: 0,
    high: 0,
    low: 0,
    close: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/stock/stock-data?symbol=${stockSymbol}&range=${timeRange}`);
        const candleData = response.data.candles;
        const latestData = candleData[candleData.length - 1];
        
        setStockData({
          current: latestData.close,
          open: latestData.open,
          high: latestData.high,
          low: latestData.low,
          close: latestData.close,
        });

        if (chart.current) {
          const candleSeries = chart.current.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
          });
          candleSeries.setData(candleData);
        }
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error('Error fetching stock data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        // width: chartContainerRef.current.clientWidth,
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

      resizeObserver.current = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        chart.current.applyOptions({ width, height });
      });
      resizeObserver.current.observe(chartContainerRef.current);
    }

    fetchData();

    return () => {
      if (chart.current) {
        chart.current.remove();
      }
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, [timeRange]);

  const changeTimeRange = (range) => {
    setTimeRange(range);
  };

  if (isLoading) return <div className="text-white">로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-black text-white p-4">
      <div className="flex justify-between items-center mb-4">
        {/* 기존 버튼들 */}
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">—</span>
          <span>삼성전자</span>
          <input type="text" value={`${stockData.current.toLocaleString()}`} className="bg-black border-b border-gray-600 w-24 text-right" readOnly />
          <span>KRW</span>
          {/* <X className="w-4 h-4" /> */}
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
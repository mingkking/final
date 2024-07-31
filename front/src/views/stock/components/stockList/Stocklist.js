// views/stock/stocklist.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Stocklist = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/stocks');
        setStocks(response.data);
        setLoading(false);
      } catch (err) {
        console.error('주식 데이터 불러오기 오류:', err);
        setError('주식 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const handleStockSelect = (stock) => {
    navigate(`/stock/${stock.stock_code}`);
  };

  if (error) return <div>에러: {error}</div>;
  if (loading) return <div className="text-center p-4">로딩 중...</div>;

  return (
    <div className="overflow-auto h-screen">
      <table className="w-full border-collapse">
        <thead className="sticky top-0 bg-white">
          <tr className="bg-gray-200">
            <th className="p-2 text-left">종목명</th>
            <th className="p-2 text-left">종목코드</th>
            <th className="p-2 text-right">고가</th>
            <th className="p-2 text-right">저가</th>
            <th className="p-2 text-right">종가</th>
            <th className="p-2 text-right">날짜</th>
            <th className="p-2 text-right">유형</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr 
              key={`${stock.stock_code}-${stock.record_date}`}
              onClick={() => handleStockSelect(stock)} 
              className="hover:bg-gray-100 cursor-pointer"
            >
              <td className="p-2">{stock.name}</td>
              <td className="p-2">{stock.stock_code}</td>
              <td className="p-2 text-right">{stock.high_price?.toLocaleString()}</td>
              <td className="p-2 text-right">{stock.low_price?.toLocaleString()}</td>
              <td className="p-2 text-right">{stock.closing_price?.toLocaleString()}</td>
              <td className="p-2 text-right">{stock.record_date}</td>
              <td className="p-2 text-right">{stock.stock_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stocklist;
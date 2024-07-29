import React, { useState, useEffect,useRef, useCallback } from 'react';
import axios from 'axios';

const Stocklist = ({ onStockSelect }) => {
  const [stocks, setStocks] = useState([]);
  const [page,setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore,setHasMore] = useState(true);
  const observer = useRef();

  const lastStockElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries =>{
      if(entries[0].isIntersecting && hasMore){
        setPage(prevPage => prevPage+1);
      }
    });
    if (node) observer.current.observe(node);
  },[loading,hasMore]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/stocks`);
        setStocks(prevStocks => {
          return page ===1?response.data :[...prevStocks, ...response.data]}); 
          // 삼항 연산자를 이용하여 첫페이지일 경우 새로운 데이터 아닐 경우 기존 데이터에 추가
        setHasMore(response.data.length === 20);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stocks:', err);
        setError('주식 데이터를 불러오는 데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchStocks();
  }, [page]);

  if (error) return <div>에러: {error}</div>;

  console.log('stocks:', stocks);

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
        {stocks.map((stock, index) => (
          <tr 
          key={`${stock.stock_code}-${stock.record_date}`}
          ref={index === stocks.length - 1 ? lastStockElementRef : null}
          onClick={() => onStockSelect(stock)} 
          className="hover:bg-gray-100 cursor-pointer"
        >
            <td className="p-2">{stock.name}</td>
            <td className="p-2">{stock.stock_code}</td>
            <td className="p-2 text-right">{stock.high_price?.toLocaleString()}</td>
            <td className="p-2 text-right">{stock.low_price?.toLocaleString()}</td>
            <td className="p-2 text-right">{stock.closing_price?.toLocaleString()}</td>
            <td className="p-2 text-right">{new Date(stock.record_date).toLocaleDateString()}</td>
            <td className="p-2 text-right">{stock.stock_type}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {loading && <div className="text-center p-4">로딩 중...</div>}
  </div>
  );
};

export default Stocklist;
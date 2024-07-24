import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Stocklist = () => {
  const navigate = useNavigate();

  // 예시 데이터. 실제로는 API에서 가져오거나 props로 받을 수 있습니다.
  const stocks = [
    { id: 1, name: '삼성전자', currentPrice: 70000, highPrice: 71000, lowPrice: 69000, time: '15:30' },
    { id: 2, name: 'SK하이닉스', currentPrice: 120000, highPrice: 122000, lowPrice: 119000, time: '15:30' },
    { id: 3, name: 'NAVER', currentPrice: 200000, highPrice: 205000, lowPrice: 198000, time: '15:30' },
  ];

  const handleRowClick = (stockId) => {
    navigate(`/stock/${stockId}`);  // 클릭한 종목의 상세 페이지로 이동
  };

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">종목명</th>
            <th className="p-2 text-right">종가</th>
            <th className="p-2 text-right">고가</th>
            <th className="p-2 text-right">저가</th>
            <th className="p-2 text-right">시간</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id} onClick={() => handleRowClick(stock.id)} style={{cursor: 'pointer'}}>
              <td>{stock.name}</td>
              <td className="text-right">{stock.currentPrice}</td>
              <td className="text-right">{stock.highPrice}</td>
              <td className="text-right">{stock.lowPrice}</td>
              <td className="text-right">{stock.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stocklist;
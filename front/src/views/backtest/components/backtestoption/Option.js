import React, { useState } from 'react';
// import { Beaker } from 'lucide-react';

const SpeedTest = () => {
  const [testDuration, setTestDuration] = useState(8);
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState('원화');
  const [billingCycle, setBillingCycle] = useState('매월');

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/3 p-6 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">신규 테스트</h2>
        
        <div className="mb-4">
          <label className="block mb-2">테스트 기간</label>
          <input 
            type="range" 
            min="1" 
            max="30" 
            value={testDuration} 
            onChange={(e) => setTestDuration(e.target.value)}
            className="w-full"
          />
          <span>{testDuration}일</span>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">테스트 금액</label>
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">테스트 자산</label>
          <button className="bg-gray-800 p-2 rounded w-full text-left">
            + 자산 추가
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">추가 납입 금액</label>
          <select 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full"
          >
            <option value="원화">원화</option>
            <option value="외화">외화</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">리밸런싱 주기</label>
          <select 
            value={billingCycle} 
            onChange={(e) => setBillingCycle(e.target.value)}
            className="bg-gray-800 p-2 rounded w-full"
          >
            <option value="매월">매월</option>
            <option value="분기">분기</option>
            <option value="반기">반기</option>
          </select>
        </div>
        
        <button className="bg-gray-700 text-white p-2 rounded w-full mb-2">
          결과 확인
        </button>
        
        <button className="bg-white text-gray-900 p-2 rounded w-full">
          내 설정 저장
        </button>
      </div>
      
      <div className="w-2/3 p-6 flex items-center justify-center">
        <div className="text-center">
          {/* <Beaker size={48} className="mx-auto mb-4" /> */}
          <p className="text-lg mb-2">관심 자산, 내 포트폴리오의 과거 수익률을 확인해보세요</p>
          <p className="text-sm text-gray-400">
            투자하기 전에는 반드시 나의 설정을 사용하세요. 동일 케이스로 투자하는 시뮬레이션으로 투자하는 사람이 정작히는지 과거 수익률을 볼 수 있다
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpeedTest;
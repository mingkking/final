import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

const ResultChart = () => {
  const chartContainerRef = useRef();
  const chart = useRef();
  const [assetData, setAssetData] = useState({
    Market: { name: 'Market(S&P500)', value: 217878028, change: 11.07, changeMonth: 23.90, changeYear: -9.65 },
    Samsung: { name: '삼성전자', value: 107158504, change: 0.94, changeMonth: 33.68, changeYear: -23.27 }
  });

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: 600,
      height: 300,
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
        textColor: 'white',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
    });

    const marketSeries = chart.current.addLineSeries({ color: '#FF4136' });
    const samsungSeries = chart.current.addLineSeries({ color: '#FFDC00' });

    // 여기에 실제 데이터를 넣어야 합니다.
    const marketData = [
      { time: '2016-06-01', value: 100000000 },
      // ... 더 많은 데이터 포인트
    ];

    const samsungData = [
      { time: '2016-06-01', value: 95000000 },
      // ... 더 많은 데이터 포인트
    ];

    marketSeries.setData(marketData);
    samsungSeries.setData(samsungData);

    chart.current.timeScale().fitContent();

    return () => {
      chart.current.remove();
    };
  }, []);

  return (
    <div className="bg-[#151924] p-4">
      <h2 className="text-xl font-bold mb-4">그래프</h2>
      <div ref={chartContainerRef} />
      <h3 className="text-lg font-bold mt-4 mb-2">자산별 현황</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">자산</th>
            <th className="text-right">최종금액</th>
            <th className="text-right">연평균 수익률</th>
            <th className="text-right">최대낙폭</th>
            <th className="text-right">최고 연 수익률</th>
            <th className="text-right">최저 연 수익률</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(assetData).map((asset) => (
            <tr key={asset.name}>
              <td>{asset.name}</td>
              <td className="text-right">{asset.value.toLocaleString()}</td>
              <td className="text-right">{asset.change.toFixed(2)}%</td>
              <td className="text-right">-24.80%</td>
              <td className="text-right">{asset.changeMonth.toFixed(2)}%</td>
              <td className="text-right">{asset.changeYear.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm">
          결과 텍스트 창
      </p>
    </div>
  );
};

export default ResultChart;
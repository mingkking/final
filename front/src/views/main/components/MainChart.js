import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart } from '@mui/x-charts/LineChart';

function MainChart() {
    const [kospiData, setKospiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchKospiData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/kospi");
                console.log("Received data:", response.data); // 데이터 구조 확인
                setKospiData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching KOSPI data", error);
                setError("KOSPI 데이터를 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };
        fetchKospiData();
    }, []);

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;
    if (kospiData.length === 0) return <div>데이터가 없습니다.</div>;

    return (
        <LineChart
            width={600}
            height={300}
            series={[{ 
                data: kospiData.map(item => item.closingPrice || item.closing_price), 
                label: 'KOSPI 종가' 
            }]}
            xAxis={[{ 
                scaleType: 'point', 
                data: kospiData.map(item => item.recordDate || item.record_date) 
            }]}
        />
    );
}

export default MainChart;
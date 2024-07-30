import React, { useContext, useState, useEffect } from 'react';
import MainContext from "../../manager/main/contexts/MainContext";
import Main from "./Main";
import Cookies from 'js-cookie';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function MainChart() {
    const [cookieValue, setCookieValue] = useState('');

    const value = useContext(MainContext);

    useEffect(() => {
        // 쿠키 값 가져오기
        const value = Cookies.get('accessToken');
        setCookieValue(value || '쿠키가 존재하지 않습니다.');
        
        console.log('cookie :>> ', value);
    }, []);

    // 현재 차트에 표시 되는 임의의 값들 랜덤 값들을 만들어 생성
    const stockData = generateDummyData(30);
    const kospiData = generateDummyData(30);

    return (
        <div>
            <Main count={value.state.todayCount} />
            <ThemeProvider theme={theme}>
                <Box sx={{height: 'auto', bgcolor: 'background.default', color: 'text.primary' }}>
                    <Box sx={{ flexGrow: 1, p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <Chart title="유가증권 차트" data={stockData} color="#8884d8" />
                            <Chart title="코스피 지수" data={kospiData} color="#82ca9d" />
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    );
}

// 테마 정의
const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            // 배경색 설정
            default: '#f0f4f8', // 전체 배경색
        },
        text: {
            // 텍스트 색상 설정
            primary: '#333', // 기본 텍스트 색상
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // 기본 폰트 설정
    },
});

// 임의의 데이터 생성 함수
const generateDummyData = (pointCount) => {
    return Array.from({ length: pointCount }, (_, i) => ({
        time: i + 1,
        value: Math.floor(Math.random() * 1000) + 500,
    }));
};

// 차트 컴포넌트
const Chart = ({ title, data, color }) => (
    <Box sx={{ width: '100%', px: 2, py: 2, backgroundColor: '#fff', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
            {title}
        </Typography>
        <LineChart
            xAxis={[{ data: data.map(item => item.time), label: 'Day' }]}
            series={[
                {
                    data: data.map(item => item.value),
                    area: true,
                    // 차트 색상 설정
                    color: color, // 차트 색상
                },
            ]}
            width={525}
            height={258}
        />
    </Box>
);

export default MainChart;

import React, { useContext } from 'react';
import MainContext from "../manager/main/contexts/MainContext";
import Main from "./components/Main";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Grid,Paper,Typography,Box } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import { ThemeProvider, createStyles, createTheme } from '@mui/material/styles';
function MainPage() {

    const [cookieValue, setCookieValue] = useState('');
    

    const value = useContext(MainContext);

    useEffect((userNickname) => {
        // 쿠키 값 가져오기
        const value = Cookies.get('accessToken');
        setCookieValue(value || '쿠키가 존재하지 않습니다.');
        
        console.log('cookie :>> ', value);
        
      }, []);

    //현재 차트에 표시 되는 임의의 값들 랜덤 값들을 만들어 생성
      const stockData = generateDummyData(30);
      const goldData = generateDummyData(30);
      const kospiData = generateDummyData(30);

    return(
        <div>
            <h1>Main 페이지</h1>
            {/* 사용자 쿠키 값을 체크 해주고 출력 차후에 수정 예정 */}

            <Main count={value.state.todayCount}/>
            <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4" gutterBottom>금융 시장 동향</Typography>
          <Box sx={{ display: 'flex', mb: 4 }}>
            <Chart title="유가증권 차트" data={stockData} color="#8884d8" />
            <Chart title="금가격 그래프" data={goldData} color="#ffc658" />
            <Chart title="코스피 지수" data={kospiData} color="#82ca9d" />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              <Typography variant="h5" gutterBottom>주요 지표</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <DashboardItem title="주요 주식" items={['삼성전자', 'SK하이닉스']} />
                </Grid>
                <Grid item xs={6}>
                  <DashboardItem title="주요 부동산" items={['서울 아파트', '경기도 아파트']} />
                </Grid>
              </Grid>
            </Grid>
            {/* 뉴스 게시판 부분 */}
            <Grid item xs={4}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom>실시간 뉴스</Typography>
                <ul>
                  <li>• 주요 경제 뉴스 헤드라인 1</li>
                  <li>• 주요 경제 뉴스 헤드라인 2</li>
                  <li>• 주요 경제 뉴스 헤드라인 3</li>
                </ul>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
        </div>
    );
}

const theme = createTheme({
    palette: {
        mode:"light",
    },
});

const DashboardItem = ({title, items}) => (
    <Paper elevation={2} sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Grid container spacing={1}>
      {items.map((item, index) => (
        <Grid item xs={6} key={index}>
          <Paper elevation={1} sx={{ p: 1, textAlign: 'center' }}>
            {item}
          </Paper>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

const generateDummyData = (pointCount) => {
    return Array.from({ length: pointCount }, (_, i) => ({
      time: i + 1,
      value: Math.floor(Math.random() * 1000) + 500,
    }));
  };


  const Chart = ({ title, data, color }) => (
    <Box sx={{ width: '33%', px: 1 }}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <LineChart
        xAxis={[{ data: data.map(item => item.time), label: 'Day' }]}
        series={[
          {
            data: data.map(item => item.value),
            area: true,
            color: color,
          },
        ]}
        width={400}
        height={300}
      />
    </Box>
  );

export default MainPage;
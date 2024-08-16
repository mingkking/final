import React from 'react';
import { Box, Typography, useTheme, Paper, Grid, Divider } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { LineChart, axisClasses } from '@mui/x-charts';

const ResultChart = ({ analysisResult, error }) => {
  const theme = useTheme();

  if (error) {
    return <Typography color="error" sx={{ p: 4, color: '#fff' }}>{error}</Typography>;
  }

  if (!analysisResult || !analysisResult.processedData || analysisResult.processedData.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', bgcolor: '#202637' }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', bgcolor: '#1B1F2C' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AutoGraphIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mr: 2 }} />
            <Typography variant="h4" color="#fff" fontWeight="bold">
              주식 분석 인공지능
            </Typography>
          </Box>
          
          <Typography variant="h6" color="#fff" paragraph>
            과거 주식 데이터를 학습하여 미래 주가 움직임을 예측합니다.
          </Typography>
          
          <Divider sx={{ my: 3, bgcolor: '#fff' }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" color="#fff" gutterBottom align='left'>
                작동 방식
              </Typography>
              <Typography variant="body1" component="ol" sx={{ pl: 2 }} align='left'>
                <dt style={{ color: '#fff' }}>1.선택한 주식의 과거 데이터 수집</dt>
                <dt style={{ color: '#fff' }}>2.전문가들이 사용하는 지표 계산</dt>
                <dt style={{ color: '#fff' }}>3.인공지능의 패턴 학습</dt>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" color="#fff" gutterBottom align='left'>
                제공 정보
              </Typography>
              <Typography variant="body1" component="ul" sx={{ pl: 2 }} align='left'>
                <dt style={{ color: '#fff' }}>1.날짜별 예상 수익예측</dt>
                <dt style={{ color: '#fff' }}>2.주가 상승/하락 예측</dt>
                <dt style={{ color: '#fff' }}>3.총 수익률 예측</dt>
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, p: 2, bgcolor:'#282E3C', borderRadius: 1 }}>
            <Typography variant="body1" fontWeight="bold" color="#fff">
              주의: 이 도구는 참고용입니다. 실제 투자 결정은 신중하게 내려야 합니다.
            </Typography>
          </Box>
        </Paper>
        
        <Typography variant="h5" color="#fff" sx={{ mt: 12 }}>
          분석을 시작하려면 옵션을 선택하고 '분석 시작' 버튼을 클릭하세요.
        </Typography>
      </Box>
    );
  }

  const koreaMonths = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${d.getFullYear()}년 ${koreaMonths[d.getMonth()]} ${d.getDate()}일`;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
  };

  const chartData = analysisResult.processedData.map(d => ({
    date: new Date(d.date),
    '예측 수익률': d.predicted_return_percentage,
    '예측 가치': d.predicted_value
  }));

  const lastPrediction = analysisResult.processedData[analysisResult.processedData.length - 1] || {};

  return (
    <Box sx={{ p: 4, bgcolor: '#202637', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#fff' }}>
        분석 결과
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 4, flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: '#202637' }}>
        <LineChart
          width={550}
          height={300}
          dataset={chartData}
          margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
          series={[
            { 
              dataKey: '예측 수익률', 
              label: '예측 수익률 (%)', 
              color: theme.palette.primary.main,
              curve: 'linear',
              showMark: false,
              yAxisKey: 'leftAxis', 
            },
            { 
              dataKey: '예측 가치', 
              label: '예측 가치 (원)', 
              color: theme.palette.secondary.main,
              curve: 'linear',
              showMark: false,
              yAxisKey: 'rightAxis', 
            },
          ]}
          xAxis={[{ 
            scaleType: 'time', 
            dataKey: 'date',
            tickLabelStyle: { angle: 45, textAnchor: 'start', fontSize: 10, color: '#fff' },
            valueFormatter: (date) => formatDate(date),
            tickNumber: 6,
          }]}
          yAxis={[
            { id: 'leftAxis', label: '예측 수익률 (%)', labelStyle: { transform: 'translateX(-20px)', color: '#fff' } },
            { id: 'rightAxis', label: '예측 가치 (원)', labelStyle: { transform: 'translateX(20px)', color: '#fff' } }
          ]}
          rightAxis="rightAxis"
          sx={{
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translate(-20px, 0)',
            },
            [`& .${axisClasses.right} .${axisClasses.label}`]: {
              transform: 'translate(20px, 0)',
            },
            [`& .${axisClasses.axisLine}`]: {
              stroke: '#fff',
            },
            [`& .${axisClasses.tick}`]: {
              stroke: '#fff',
            },
          }}
        />
      </Paper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#202637' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShowChartIcon color="warning" sx={{ fontSize: 30,  mr: 2 }} />
              <Typography variant="h6" color="#FFAE1F">
                주식명: {analysisResult.stockName || 'N/A'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DateRangeIcon color="warning" sx={{ fontSize: 24, mr: 2 }} />
              <Typography variant="body1" color="#fff">
                분석 기간: {formatDate(analysisResult.startDate)} ~ {formatDate(analysisResult.endDate)}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={2} sx={{ p: 3, bgcolor: '#202637' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TrendingUpIcon color= "warning" sx={{ fontSize: 30,  mr: 2 }} />  <Typography variant="h6" color="#FFAE1F">
                예측 결과
              </Typography>
            </Box>
            <Typography variant="body1" gutterBottom color="#fff">
              초기 투자금: {formatCurrency(analysisResult.initialInvestment)}
            </Typography>
            <Typography variant="body1" gutterBottom color="#fff">
              최종 예측 가치: {formatCurrency(analysisResult.finalPredictedValue)}
            </Typography>
            <Typography variant="body1" gutterBottom color="#fff">
              총 수익률: {analysisResult.totalReturn.toFixed(2)}%
            </Typography>
            <Typography variant="body1" color="#fff">
              최종 예측 움직임: {lastPrediction.predicted_movement || 'N/A'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultChart;

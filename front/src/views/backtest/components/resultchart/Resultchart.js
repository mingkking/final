import React from 'react';
import { Box, Typography, useTheme, Paper } from '@mui/material';
import { LineChart, axisClasses } from '@mui/x-charts';

const ResultChart = ({ analysisResult, error }) => {
  const theme = useTheme();

  if (error) {
    return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  }

  if (!analysisResult || !analysisResult.processedData || analysisResult.processedData.length === 0) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography align="center" variant="h6" color="text.secondary">
          분석을 시작하려면 옵션을 선택하고 '분석 시작' 버튼을 클릭하세요.
        </Typography>
      </Box>
    );
  }

  const koreaMonths = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"]
  
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}년 ${koreaMonths[d.getMonth()]} ${d.getDay()}일`;
  }

  const chartData = analysisResult.processedData.map(d => ({
    date: new Date(d.date),
    '예측 수익률': d.predicted_return
  }));

  return (
    <Box sx={{ p: 4, bgcolor: theme.palette.background.paper, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: theme.palette.primary.main }}>
        분석 결과
      </Typography>
      <Paper elevation={3} sx={{ p: 3, mb: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <LineChart
          width={550}
          height={300}
          dataset={chartData}
          margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
          series={[
            { 
              dataKey: '예측 수익률', 
              label: '예측 수익률', 
              color: theme.palette.primary.main,
              curve: 'linear',
              showMark: false, 
            },
          ]}
          xAxis={[{ 
            scaleType: 'time', 
            dataKey: 'date',
            label: '날짜',
            tickLabelStyle: { angle: 45, textAnchor: 'start', fontSize: 12 },
            valueFormatter: (date) => formatDate(date),
            tickNumber: 6,
          }]}
          yAxis={[{ 
            label: '예측 수익률',
            labelStyle: { transform: 'translateX(-20px)' },
          }]}
          sx={{
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: 'translate(-20px, 0)',
            },
          }}
        />
      </Paper>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom color="primary">
          주식명: {analysisResult.stockName}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          분석 기간: {formatDate(analysisResult.startDate)} ~ {formatDate(analysisResult.endDate)}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          최종 예측 수익: {analysisResult.processedData[analysisResult.processedData.length - 1].predicted_return.toFixed(2)}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          최종 예측 움직임: {analysisResult.processedData[analysisResult.processedData.length - 1].predicted_movement}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultChart;
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { LineChart, axisClasses } from '@mui/x-charts';

const ResultChart = ({ analysisResult, error }) => {
  const theme = useTheme();

  if (error) {
    return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  }

  if (!analysisResult) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Typography align="center">
          분석을 시작하려면 옵션을 선택하고 '분석 시작' 버튼을 클릭하세요.
        </Typography>
      </Box>
    );
  }

  const chartData = analysisResult.processedData.map(d => ({
    date: new Date(d.record_date).toLocaleDateString(),
    '종가': d.closing_price,
    'SMA 20': d.sma_20,
    'EMA 20': d.ema_20
  }));

  return (
    <Box sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
      <Typography variant="h5" gutterBottom>분석 결과</Typography>
      <LineChart
        width={600}
        height={300}
        dataset={chartData}
        series={[
          { dataKey: '종가', label: '종가', color: theme.palette.primary.main },
          { dataKey: 'SMA 20', label: 'SMA 20', color: theme.palette.secondary.main },
          { dataKey: 'EMA 20', label: 'EMA 20', color: theme.palette.error.main },
        ]}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'date',
          label: '날짜',
        }]}
        yAxis={[{ label: '가격' }]}
        sx={{
          [`& .${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
          },
        }}
      />
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          다음 날 주가 상승 확률: {(analysisResult.predictionProbability * 100).toFixed(2)}%
        </Typography>
        <Typography variant="body1" gutterBottom>
          총 수익률: {(analysisResult.totalReturn * 100).toFixed(2)}%
        </Typography>
        <Typography variant="body1" gutterBottom>
          샤프 비율: {analysisResult.sharpeRatio.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultChart;
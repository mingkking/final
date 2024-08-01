import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { LineChart, axisClasses } from '@mui/x-charts';

const ResultChart = ({ analysisResult, error }) => {
  const theme = useTheme();

  if (error) {
    return <Typography color="error" sx={{ p: 2 }}>{error}</Typography>;
  }

  if (!analysisResult || !analysisResult.processedData || analysisResult.processedData.length === 0) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <Typography align="center">
          분석을 시작하려면 옵션을 선택하고 '분석 시작' 버튼을 클릭하세요.
        </Typography>
      </Box>
    );
  }

  const chartData = analysisResult.processedData.map(d => ({
    date: d.date,
    '예측 수익률': d.predicted_return
  }));

  return (
    <Box sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
      <Typography variant="h5" gutterBottom>분석 결과</Typography>
      <LineChart
        width={600}
        height={300}
        dataset={chartData}
        series={[
          { dataKey: '예측 수익률', label: '예측 수익률', color: theme.palette.primary.main },
        ]}
        xAxis={[{ 
          scaleType: 'point', 
          dataKey: 'date',
          label: '날짜',
        }]}
        yAxis={[{ label: '예측 수익률' }]}
        sx={{
          [`& .${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
          },
        }}
      />
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          모델 MAE: {analysisResult.modelMAE.toFixed(4)}
        </Typography>
        <Typography variant="body1" gutterBottom>
          주식명: {analysisResult.stockName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          분석 기간: {analysisResult.startDate} ~ {analysisResult.endDate}
        </Typography>
        <Typography variant="body1" gutterBottom>
          최종 예측 수익률: {analysisResult.processedData[analysisResult.processedData.length - 1].predicted_return.toFixed(2)}
        </Typography>
        <Typography variant="body1" gutterBottom>
          최종 예측 움직임: {analysisResult.processedData[analysisResult.processedData.length - 1].predicted_movement}
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultChart;
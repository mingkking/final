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
          분석 결과가 없습니다. 다시 시도해 주세요.
        </Typography>
      </Box>
    );
  }

  const chartData = analysisResult.processedData.map(d => ({
    date: new Date(d.date).toLocaleDateString(),
    '예측 확률': d.predicted_probability,
    '예측 움직임': d.predicted_movement === 'Up' ? 1 : 0
  }));

  return (
    <Box sx={{ p: 3, bgcolor: theme.palette.background.paper }}>
      <Typography variant="h5" gutterBottom>분석 결과</Typography>
      <LineChart
        width={600}
        height={300}
        dataset={chartData}
        series={[
          { dataKey: '예측 확률', label: '예측 확률', color: theme.palette.primary.main },
          { dataKey: '예측 움직임', label: '예측 움직임', color: theme.palette.secondary.main, yAxisKey: 'movement' },
        ]}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'date',
          label: '날짜',
        }]}
        yAxis={[
          { label: '확률' },
          { id: 'movement', label: '움직임', min: 0, max: 1 }
        ]}
        sx={{
          [`& .${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)',
          },
        }}
      />
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          모델 정확도: {(analysisResult.modelAccuracy * 100).toFixed(2)}%
        </Typography>
      </Box>
    </Box>
  );
};

export default ResultChart;
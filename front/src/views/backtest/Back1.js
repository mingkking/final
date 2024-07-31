import React, { useState } from "react";
import Options from "./components/backtestoption/Option";
import ResultChart from "./components/resultchart/Resultchart"
import { Card, Container, Grid, Typography, Box, useTheme } from "@mui/material";
import axios from 'axios';

const Back1 = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const theme = useTheme();

  const handleAnalyze = async (options) => {
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/analyze', options);
      setAnalysisResult(response.data);
    } catch (error) {
      setError('분석 중 오류가 발생했습니다: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          백테스트
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <Options onAnalyze={handleAnalyze} />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <ResultChart analysisResult={analysisResult} error={error} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Back1;

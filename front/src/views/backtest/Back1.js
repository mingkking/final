import React, { useState, useEffect } from "react";
import Options from "./components/backtestoption/Option";
import ResultChart from "./components/resultchart/Resultchart"
import { Card, Container, Grid, Typography, Box, useTheme, CircularProgress, Snackbar, Alert } from "@mui/material";
import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// axios 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    console.log('Request config:', JSON.stringify(config, null, 2));
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error('Response error:', error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

const Back1 = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const theme = useTheme();
  
  const handleAnalyze = async (options) => {
    setError('');
    setAnalysisResult(null);
    setIsLoading(true);
    try {
      console.log('Sending request with options:', options);
      const response = await api.post('/analyze', options, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Received response:', response.data);
      if (response.data && response.data.processedData) {
        setAnalysisResult(response.data);
      } else {
        throw new Error('서버로부터 유효하지 않은 응답을 받았습니다.');
      }
    } catch (error) {
      console.error('Error in handleAnalyze:', error);
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else if (error.response) {
        // 서버 응답이 있는 경우
        setError(`서버 오류: ${error.response.status} - ${error.response.data.message || error.message}`);
      } else if (error.request) {
        // 요청이 만들어졌으나 응답을 받지 못한 경우
        setError('서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.');
      } else {
        // 요청을 만드는 중에 오류가 발생한 경우
        setError(`오류 발생: ${error.message}`);
      }
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: '100vh', py: 4 }}>
    <Container maxWidth="lg">
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, color: theme.palette.primary.main, fontWeight: 'bold' }}>
        백테스트
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <Options onAnalyze={handleAnalyze} />
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <ResultChart analysisResult={analysisResult} error={error} />
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
    <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
      <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar>
  </Box>
);
};
export default Back1;
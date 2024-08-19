import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import Options from "./components/backtestoption/Option";
import ResultChart from "./components/resultchart/Resultchart"
import { Paper,Card, Container, Grid, Typography, Box, useTheme, CircularProgress, Snackbar, Alert,Fade } from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import axios from 'axios';
import axiosInstance from "../login/component/Token/axiosInstance"
import CommunityContext from "../community/contexts/CommunityContext"
import StockContext from "../stock/components/context/StockContext"

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
  const navigate = useNavigate();
  const communityValue = useContext(CommunityContext);
  useEffect(() => {
    loginCheck();
  }, [])
  const loginCheck = async () => {
    try {
      const response = await axiosInstance.get('/check-login-status', {
        withCredentials: true,
      });

      if (response.data.isLoggedIn !== true) {
        alert("로그인 및 구독 후 이용해주세요!");
        navigate("/login");
      } else {
        communityValue.actions.setUserNick(response.data.userNickname);
        communityValue.actions.setUserNum(response.data.userNum);

        // 비동기때문에 await 후 값 받아와서 subscribeTF 에 담기
        const subscribeTF = await checkSubcribe(response.data.userNum);

        // subscribeTF 값이 False 이면
        if (!subscribeTF) {
          alert('구독 후 이용해주세요!');
          navigate('/Subscribe');
        } else {
          return true;  // 구독 완료 상태 일 때 true 반환
        }

      }
    } catch (error) {
      console.error("로그인 상태 확인 중 오류 발생:", error);
      alert("로그인 상태를 확인하는 중 오류가 발생했습니다.");
      return false;
    }
  };

    // 구독 확인 springboot에서 값 받아오는 함수
    const checkSubcribe = async (user_num) => {

      // 로그인 한 유저의 user_num 을 springboot로 넘김
      const result = await axios.get(`http://localhost:8080/subscribe/${user_num}`);
      // boolean 값으로 result.data 값이 1이면 true, 아니면 false로 return
      return result.data === 1;
  }

  const handleAnalyze = async (options) => {
    setError('');
    setAnalysisResult(null);
    setIsLoading(true);
    try {
      console.log('Sending request with options:', options);
      const response = await api.post('/flask/analyze', options, {
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
    <Box sx={{ bgcolor: '#131722', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ mb: 2, p: 2, backgroundColor: '#202636' }}>
          <Typography variant="h4" component="h1" align="center" sx={{ color: theme.palette.primary.contrastText, fontWeight: "bold" }}>
            백테스트
          </Typography>
        </Paper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ height: '100%' ,bgcolor:"#202637"}} >
              <Options onAnalyze={handleAnalyze} />
            </Card>
          </Grid>
          <Grid item xs={12} md={7}>
            <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {isLoading ? (
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexGrow: 1,
                  bgcolor: "#202637",
                  p: 4
                }}>
                  <Fade in={true} style={{ transitionDelay: '300ms' }}>
                    <BarChartIcon sx={{ fontSize: 60, color: '#FFAE1F', mb: 2 }} />
                  </Fade>
                  <CircularProgress size={60} sx={{ color: '#FFAE1F', mb: 2 }} />
                  <Typography variant="h6" color="white" align="center" gutterBottom>
                    분석 중입니다...
                  </Typography>
                  <Typography variant="body2" color="grey.500" align="center">
                    이 과정은 약 1-2분 정도 소요될 수 있습니다.
                  </Typography>
                  <Typography variant="body2" color="grey.500" align="center" sx={{ mt: 2 }}>
                    데이터를 수집하고 AI 모델을 통해 분석하고 있습니다.
                  </Typography>
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
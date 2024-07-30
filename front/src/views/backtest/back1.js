import React, { useState } from "react";
import Options from "./components/backtestoption/Option";
import ResultChart from "./components/resultchart/Resultchart"
import { Card, Container, Grid, Typography } from "@mui/material";
import axios from 'axios';

const Back1 = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

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
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <Options onAnalyze={handleAnalyze} />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <ResultChart analysisResult={analysisResult} error={error} />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Back1;
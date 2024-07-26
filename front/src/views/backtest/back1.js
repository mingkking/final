import React from "react";
import Option from "./components/backtestoption/Option"
import ResultChart from "./components/resultchart/Resultchart"
import { Card, Container, Grid,Box,CssBaseline } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
// import { ArrowLeft } from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
;



const back1 = () => {
  return (
    <Container>
      <h1>back1 페이지 내용</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <Option />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <ResultChart />
          </Card>
        </Grid>
      </Grid>

    </Container>
  )
};

export default back1;
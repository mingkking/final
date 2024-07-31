import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Grid, 
  Typography, 
  Box, 
  useTheme, 
  useMediaQuery,
  Paper
} from "@mui/material";
import Stocklist from "./components/stockList/Stocklist";

const StockMain = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className='container'>
    <Box sx={{ 
      bgcolor: theme.palette.background.default, 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Paper elevation={3} sx={{ mb: 2, p: 2, backgroundColor: theme.palette.primary.main }}>
        <Typography variant="h4" component="h1" align="center" sx={{ color: theme.palette.primary.contrastText }}>
          국내주식
        </Typography>
      </Paper>
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ 
              height: isMobile ? 'auto' : '200px', // 고정 높이 설정
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center',
              p: 2
            }}>
              <Typography variant="body1" color="text.secondary">
                검색 기능이 들어갈 자리입니다.
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', height: isMobile ? 'auto' : 'calc(100vh - 200px)' }}>
            <Card elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <Stocklist onStockSelect={handleStockSelect} />
            </Card>
          </Grid> 
        </Grid>
      </Container>
    </Box>
    </div>
  );
};

export default StockMain;
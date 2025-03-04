import React, { useState } from 'react';
import { 
  Container, 
  Card, 
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
    <Container>
    <Box sx={{  
      bgcolor: '#1B1F2C', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Paper elevation={3} sx={{ mb: 2, p: 2, backgroundColor: '#202636' }}>
        <Typography variant="h4" component="h1" align="center" sx={{ color: theme.palette.primary.contrastText ,fontWeight:"bold"}}>
          국내주식
        </Typography>
      </Paper>
      <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' ,bgcolor: '#202637' }}>
        <Card 
          elevation={3} 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            height: isMobile ? 'auto' : 'calc(100vh - 200px)' ,
            fontWeight:"bold",
            backgroundColor:'#1B1F2C',
          }}
        >
          <Stocklist onStockSelect={handleStockSelect} />
        </Card>
      </Container>
    </Box>
    </Container>
  );
};

export default StockMain; 
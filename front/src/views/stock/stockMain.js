import React, { useState } from 'react';
import { Container, Card, Grid } from "@mui/material";
import Stocklist from "./components/Stocklist";
// import { createChart, CrosshairMode } from 'lightweight-charts';

const StockMain = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <h2>국내주식</h2>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              {selectedStock ? (
                <createChart stockSymbol={selectedStock.id} />
              ) : (
                <div>종목을 선택해주세요.</div>
              )}
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <Stocklist onStockSelect={handleStockSelect} />
            </Card>
          </Grid> 
        </Grid>
      </Container>
    </div>
  );
};
export default StockMain;
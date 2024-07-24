// import { useEffect,useRef,useState } from "react";
// import CandleChart from "./components/CanddleChart"
import { Container ,Card} from "@mui/material";
import Stocklist from "./components/Stocklist"
// import React from "react";

const ju1 = () => {
  const candleData = [
    { time: { year: 2023, month: 1, day: 1 }, open: 100, high: 110, low: 90, close: 105 },
    { time: { year: 2023, month: 1, day: 2 }, open: 105, high: 115, low: 100, close: 110 },
    { time: { year: 2024, month: 1, day: 2 }, open: 105, high: 115, low: 100, close: 110 },
    // ... 더 많은 데이터
  ];
  
  const volumeData = [
    { time: { year: 2023, month: 1, day: 1 }, value: 1000000 },
    { time: { year: 2023, month: 1, day: 2 }, value: 1200000 },
    { time: { year: 2024, month: 1, day: 2 }, value: 1200000 },

    // ... 더 많은 데이터
  ];
  return(<div>
    <h1>주식페이지에 대한 내용</h1>
    <Container>
      <Card>
        <Stocklist/>
      </Card>
      </Container>
  </div>)
};
export default ju1;
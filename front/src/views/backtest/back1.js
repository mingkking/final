import React from "react";
import Option from "./components/backtestoption/Option"
import ResultChart from "./components/resultchart/Resultchart"
import { Container ,Card, Grid} from "@mui/material";

const back1 = () => {
  return (
  <Container><h1>back1 페이지 내용</h1>
  <Card >
    <Option/>
    </Card>
    <Card>
      <ResultChart/>
      </Card>
    </Container>
  )  
};
export default back1;
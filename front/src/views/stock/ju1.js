// import { useEffect,useRef,useState } from "react";
// import CandleChart from "./components/CanddleChart"
import { Container ,Card, Grid} from "@mui/material";
import Stocklist from "./components/Stocklist"
// import React from "react";

const ju1 = () => {

  return(
    <div>
  <div>
    <h1>주식페이지에 대한 내용</h1>
    </div>
    <div>
    <Container>
      <Grid>
      국내주식
      </Grid>
      <Card>
        <Stocklist/>
      </Card>
      </Container>
      </div>
      </div>
  )
};
export default ju1;
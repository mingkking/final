import { Container ,Card, Grid} from "@mui/material";
import Stocklist from "./components/Stocklist"
// import Stockdetail from "./components/stockdetail/Stockdetail"
// import React from "react";

const stockMain = () => {

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
      {/* <Stockdetail/> */}
      </div>
      </div>
  )
};
export default stockMain;
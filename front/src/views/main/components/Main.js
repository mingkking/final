import React, { useEffect, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';

import mainContext from "../../manager/main/contexts/MainContext";

const MemberCount = ({count}) => {

  // 이거 방문자 수(session) 구하는 거라서 여기부터 삭제하지 말아주세용 - 혜경
  const value = useContext(mainContext);

  useEffect(()=>{
    axios.get('http://localhost:8080')
    // .then((result)=>console.log(result.data.selectTotalSession))
    .then((result) => {
      value.actions.setTotalCount(result.data.selectTotalSession);
      value.actions.setTodayCount(result.data.selectTodaySession);
      value.actions.setMonthCount(result.data.selectMonthSession);
    })
  },[]);
  // 이거 방문자 수 구하는 거라서 여기까지 삭제하지 말아주세용 - 혜경

  return (
    <div>
        {/* 
        <Grid>
          <Grid>
            <Typography>
              {count}
            </Typography>
          </Grid>
        </Grid>
        */} 
    </div>
  );
};

export default MemberCount;



import React, { useEffect, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import DashboardCard from '../../../../components/shared/DashboardCard';
import mainContext from "../../main/contexts/MainContext";

const MemberCount = ({title, count}) => {

  const value = useContext(mainContext);

  const navigate = useNavigate();

  const movePage = () => {
    navigate("/memberList");
  }

  useEffect(()=>{
    axios.get('http://localhost:8080/main')
    // .then((result)=>console.log(result.data.selectTotalSession))
    .then((result) => {
      value.actions.setTotalCount(result.data.selectTotalSession);
      value.actions.setTodayCount(result.data.selectTodaySession);
      value.actions.setMonthCount(result.data.selectMonthSession);
    })
  },[]);

  return (
    <div onClick={movePage}>
      <DashboardCard title={title}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* column */}
          <Grid item xs={7} sm={7}>
            <Typography variant="h3" fontWeight="700" style={{ textAlign: 'center' }}>
              {count}
            </Typography>
          </Grid>
        </Grid>
      </DashboardCard>
    </div>
  );
};

export default MemberCount;



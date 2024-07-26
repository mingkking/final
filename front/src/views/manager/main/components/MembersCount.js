import React, { useEffect, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';

import DashboardCard from '../../../../components/shared/DashboardCard';
import mainContext from "../contexts/MainContext";

const MemberCount = ({title, count}) => {

  const value = useContext(mainContext);

  useEffect(()=>{
    axios.get('http://localhost:8080')
    .then((result) => {
      // manager/main 새로고침 할 때 마다 DB에서 값 받아서 데이터 넣기
      value.actions.setMembersCount(result.data.selectTotalMembers);
      value.actions.setTodayMembersCount(result.data.selectTodayMembers);
      value.actions.setTotalSubscribersCount(result.data.selectTotalSubscribers);
    })
  },[]);


  return (
    <div>
      <DashboardCard title={title}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
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



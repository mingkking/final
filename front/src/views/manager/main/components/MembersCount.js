import React, { useEffect, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';

import DashboardCard from '../../../../components/shared/DashboardCard';
import mainContext from "../contexts/MainContext";

const MemberCount = ({title, count}) => {

  const value = useContext(mainContext);

  // SpringBoot 에서 값 가져와서 context파일에 저장하기
  useEffect(()=>{
    axios.get('http://localhost:8080')
    .then((result) => {
      value.actions.setMembersCount(result.data.selectTotalMembers);
      value.actions.setTodayMembersCount(result.data.selectTodayMembers);
      value.actions.setTotalSubscribersCount(result.data.selectTotalSubscribers);
      value.actions.setLast5DaysMember(result.data.selectLast5DaysMember);
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



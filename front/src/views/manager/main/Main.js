import React, { useContext } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';


// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import MonthlyEarnings from './components/MonthlyEarnings';
import MemberCount from './components/MembersCount';

import mainContext from "../main/contexts/MainContext";



const Dashboard = () => {

  const value = useContext(mainContext);


  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
        <Grid item xs={12} lg={2}>
            <MemberCount title="금일 방문자수" count={value.state.todayCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='월 방문자수' count={value.state.monthCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='총 방문자수' count={value.state.totalCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='총 회원수'/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='금일 가입수'/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='총 구독자수'/>
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;

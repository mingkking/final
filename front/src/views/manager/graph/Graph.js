import React, { useContext } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';

// components
import TodayJoinMembers from './components/TodayJoinMembers';
import MonthJoinMembers from './components/MonthJoinMembers';
import YearJoinMembers from './components/YearJoinMembers';
import MembersLine from './components/MembersLine';
import SubscribeMembersLine from './components/SubscribeMembersLine';
import CountSomething from './components/CountSomething'
import mainContext from "../main/contexts/MainContext";



const Dashboard = () => {

  const value = useContext(mainContext);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}>
            <TodayJoinMembers />
          </Grid>
          <Grid item xs={12} lg={4}>
            <MonthJoinMembers />
          </Grid>
          <Grid item xs={12} lg={4}>
            <YearJoinMembers />
          </Grid>

          <Grid item xs={12} lg={6}>
            <MembersLine />
          </Grid>
          <Grid item xs={12} lg={6}>
            <SubscribeMembersLine />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='총 가입자 수' count={value.state.membersCount}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='금일 가입자 수'/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='총 구독자 수' count={value.state.totalSubscribersCount}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='금일 구독자 수'/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='총 방문자 수' count={value.state.totalCount}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='금일 방문자 수' count={value.state.todayCount}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='채팅방 수'/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='게시글 수'/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='댓글 수'/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='게시글 신고 수'/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='댓글 신고 수'/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='좋아요 수'/>
          </Grid>
            </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;

import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import axios from 'axios';

// components
import TodayJoinMembers from './components/TodayJoinMembers';
import MonthJoinMembers from './components/MonthJoinMembers';
import YearJoinMembers from './components/YearJoinMembers';
import MemberAgeDonut from './components/MemberAgeDonut';
import SubscribeMembersLine from './components/SubscribeMembersLine';
import CountSomething from './components/CountSomething'
import mainContext from "../main/contexts/MainContext";



const Dashboard = () => {

  const value = useContext(mainContext);


    // SpringBoot 에서 값 가져와서 context파일에 저장하기
    useEffect(()=>{
      axios.get('http://localhost:8080/manager/graph')
      .then((result) => {
        value.actions.setTodaySubscribersCount(result.data.selectTodaySubscribers);
        value.actions.setCountByAgeMember(result.data.countByAgeMember);
        value.actions.setCommCount(result.data.selectCommCount);
        value.actions.setLast5DaysMember(result.data.selectLast5DaysMember);
        value.actions.setLast5MonthsMember(result.data.selectLast5MonthsMember);
        value.actions.setLast2YearsMember(result.data.selectLast2YearsMember);
        value.actions.setTotalCount(result.data.selectTotalSession);
        value.actions.setTodayCount(result.data.selectTodaySession);
        value.actions.setCountReply(result.data.countReply);
        value.actions.setUserLike(result.data.userLike);
        value.actions.setCPPostCount(result.data.CPPostCount);
        value.actions.setCPReplyCount(result.data.CPReplyCount);
        value.actions.setSelectRecent6Sub(result.data.selectRecent6Sub);
        value.actions.setSelectLastYearSub(result.data.selectLastYearSub);
      });
    }, []);

    // 채팅방 수 가져오기
    useEffect(() => {
      axios.get('http://localhost:8080/manager/chat')
      .then((result) => {
        value.actions.setChatRoomCount(result.data.chatRoomCount);
      })
    }, []);



  return (
    <PageContainer title="통계" description="통계 그래프 화면">
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
            <MemberAgeDonut />
          </Grid>
          <Grid item xs={12} lg={6}>
            <SubscribeMembersLine />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='총 가입자 수' count={value.state.membersCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='금일 가입자 수' count={value.state.todayMembersCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='총 구독자 수' count={value.state.totalSubscribersCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='금일 구독자 수' count={value.state.todaySubscribersCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='총 방문자 수' count={value.state.totalCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='금일 방문자 수' count={value.state.todayCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='채팅방 수' count={value.state.chatRoomCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='게시글 수' count={value.state.commCount} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='댓글 수' count={value.state.countReply} />
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='게시글 신고 수' count={value.state.CPPostCount}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='댓글 신고 수' count={value.state.CPReplyCount}/>
          </Grid>
          <Grid item xs={12} lg={3}>
            <CountSomething title='좋아요 수' count={value.state.userLike} />
          </Grid>
            </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;

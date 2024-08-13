import React, { useContext, useEffect } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import axiosInstance from "../../login/component/Token/axiosInstance";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// components
import SalesOverview from './components/SalesOverview';
import MembersGraph from './components/MembersGraph';
import SubscribeTotalWon from './components/SubscribeTotalWon';
import MemberCount from './components/MembersCount';
import mainContext from "../main/contexts/MainContext";



const Dashboard = () => {

  const value = useContext(mainContext);
  const navigate = useNavigate();

  // 로그인 확인 함수
  useEffect(() => {
    loginCheck();
  }, []);

     // 로그인 / 관리자 여부 함수
     const loginCheck = async () => {
      const response = await axiosInstance.get('/check-login-status', { 
          withCredentials: true, 
      });
  
      if (response.data.isLoggedIn !== true) {
          alert("로그인 후 접속 가능합니다!");   
          navigate("/login");                         
      }else {
        // 로그인 했으면 userNum 설정
        value.actions.setUserNum(response.data.userNum);

        // checkManager 함수에 userNum 값 보내기
        value.actions.ifAdmin1 = await checkManager(response.data.userNum);
        console.log("매니저면 True이겠지(main.js/value.actions.ifAdmin1값): ", value.actions.ifAdmin1);

        // 값이 False면 관리자가 아니니까 처리
        if (!value.actions.ifAdmin1) {
          alert("관리자만 접속 가능합니다.");
          navigate("/");
        }
    }
  }

  // 관리자 여부 확인
  const checkManager = async (user_num) => {

    // 로그인 한 유저의 user_num을 springBoot로 넘김
    const result = await axios.get(`http://localhost:8080/manager/${user_num}`);

    return result.data === 1;
  }


  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
        <Grid item xs={12} lg={2}>
            <MemberCount title="일 방문자수" count={value.state.todayCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='월 방문자수' count={value.state.monthCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='총 방문자수' count={value.state.totalCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='총 회원수' count={value.state.membersCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='일 가입수'count={value.state.todayMembersCount}/>
          </Grid>
          <Grid item xs={12} lg={2}>
            <MemberCount title='총 구독자수' count={value.state.totalSubscribersCount}/>
          </Grid>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MembersGraph />
              </Grid>
              <Grid item xs={12}>
                <SubscribeTotalWon />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;

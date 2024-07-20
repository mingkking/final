import React, { useContext } from 'react';
import { Typography, Grid } from '@mui/material';

import PageContainer from '../../../components/container/PageContainer'
import DashboardCard from '../../../components/shared/DashboardCard';
import BlankCard from '../../../components/shared/BlankCard';
import MemberListTest from './components/MemberList';
import mainContext from "../main/contexts/MainContext";


const MemberList = () => {

  // 컴포넌트 10번 반복 (memberList)
  // const memberList = Array(10).fill(null);
  const value = useContext(mainContext);


  return (
    <PageContainer title="Typography" description="this is Typography">
      <Grid container spacing={3}>
        <Grid item sm={15}>
        <DashboardCard >
          <div style={{display: 'flex'}}>
            <Typography variant="h4" style={{marginBottom: '20px', marginLeft: '30px'}}>번호</Typography>
            <Typography variant="h4" style={{marginBottom: '20px', marginLeft: '70px'}}>이름</Typography>
            <Typography variant="h4" style={{marginBottom: '20px', marginLeft: '100px'}}>닉네임</Typography>
            <Typography variant="h4" style={{marginBottom: '20px', marginLeft: '100px'}}>전화번호</Typography>
            <Typography variant="h4" style={{marginBottom: '20px', marginLeft: '120px'}}>이메일</Typography>
            <Typography variant="h4" style={{marginBottom: '20px', marginLeft: '100px'}}>가입일자</Typography>
            <Typography variant="h4" style={{marginBottom: '20px', marginLeft: '70px'}}>구독일시</Typography>
          </div>
            <Grid container spacing={3}>
              <Grid item sm={12}>
                {/* {value.memberList.map((member, index) => (
                  <BlankCard key={index}>
                    <MemberListTest num={index+1} name={member.user_name} nickname={member.user_nickname}/>
                  </BlankCard>
                ))} */}
                {value.state.memberList.map((member, index) => (
                  <BlankCard key={index}>
                    <MemberListTest num={member[index].user_num} name={value.state.memberList[0].user_name} nickname={value.state.memberList[0].user_nickname}/>
                  </BlankCard>
                ))}
                  {/* <BlankCard key={value.state.memberList.user_num}>
                    <MemberListTest num={value.state.memberList[0].user_num} name={value.state.memberList[0].user_name} nickname={value.state.memberList[0].user_nickname}/>
                  </BlankCard> */}
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid >
    </PageContainer>
  );
};

export default MemberList;

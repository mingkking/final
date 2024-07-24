import React, { useContext } from 'react';
import { Typography, Grid, Button } from '@mui/material';

import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import mainContext from "../main/contexts/MainContext";

const MemberList = () => {
  const value = useContext(mainContext);

  

  return (
    <PageContainer title="Typography" description="this is Typography">
      <Grid container spacing={3}>
        <Grid item sm={6}>
          {/* 멤버 리스트 헤더 */}
          <div align='left' style={{marginTop: '100px'}}>
            <Typography variant="h3" style={{ textAlign: 'center', marginBottom: '50px'}}>회원 상세 보기</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px'}}>번호</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px'}}>이름</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px'}}>닉네임</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px'}}>전화번호</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px'}}>이메일</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px'}}>가입일자</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px'}}>구독일시</Typography>
          </div>
          <Button>회원삭제</Button>
        </Grid>
        <Grid item sm={6}>
          <Grid container spacing={3}>
            <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px'}}>
              <Typography variant='h4' align='left' style={{ marginBottom: '20px'}}>관심 목록</Typography>
              <DashboardCard>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <Typography variant='h5' style={{ marginBottom: '20px' }}>분류</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant='h5' style={{ marginBottom: '20px' }}>항목</Typography>
                      </Grid>
                    </Grid>
                      <div style={{ borderBottom: '1px solid #c9c9c9',  marginBottom: '20px' }} />
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <Typography>주식</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography>삼성전자</Typography>
                      </Grid>
                    </Grid>

                  </Grid>
                </Grid>
              </DashboardCard>
            </Grid>
            <Grid item sm={12}>
              <Typography variant='h4' align='left' style={{ marginBottom: '20px'}}>글 작성 목록</Typography>
              <DashboardCard>
                <Grid container spacing={3}>
                      <Grid item sm={4}>
                        <Typography variant='h5' style={{ marginBottom: '20px' }}>글 제목</Typography>
                      </Grid>
                      <Grid item sm={4}>
                        <Typography variant='h5' style={{ marginBottom: '20px' }}>글 내용</Typography>
                      </Grid>
                      <Grid item sm={4}>
                        <Typography variant='h5' style={{ marginBottom: '20px' }}>작성 날짜</Typography>
                      </Grid>
                </Grid>
                <div style={{ borderBottom: '1px solid #c9c9c9',  marginBottom: '20px' }} />
                <Grid container spacing={3}>
                      <Grid item sm={4}>
                        <Typography>요즘 장이 너...</Typography>
                      </Grid>
                      <Grid item sm={4}>
                        <Typography>오르락 내리...</Typography>
                      </Grid>
                      <Grid item sm={4}>
                        <Typography>2024-07-22</Typography>
                      </Grid>
                </Grid>
              </DashboardCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MemberList;

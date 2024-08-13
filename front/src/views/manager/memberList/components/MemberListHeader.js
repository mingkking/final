import React from 'react';
import { Typography, Grid } from '@mui/material';




const MemberListHeader = () => {


  return (
    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>회원번호</Typography>
    </Grid>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>이름</Typography>
    </Grid>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>닉네임</Typography>
    </Grid>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>전화번호</Typography>
    </Grid>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>가입일자</Typography>                  
    </Grid>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>구독일자</Typography>
    </Grid>
  </Grid>
  );
};

export default MemberListHeader;



import React from 'react';
import { Typography, Grid } from '@mui/material';




const MemberListHeader = () => {


  return (
    <Grid container spacing={3} style={{ marginBottom: '20px' }}>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>회원번호</Typography>
    </Grid>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>작성 회원명</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography variant='h5' align='center'>댓글 내용</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography variant='h5' align='center'>신고 내용</Typography>                  
    </Grid>
    <Grid item xs={2}>
      <Typography variant='h5' align='center'>신고 일자</Typography>
    </Grid>
  </Grid>
  );
};

export default MemberListHeader;


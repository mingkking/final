import React from 'react';
import { Typography, Grid } from '@mui/material';




const ChatHeader = () => {


  return (
    <Grid container spacing={3} style={{ fontWeight: 'bold', marginBottom: '10px' }}>
    <Grid item xs={3}>
      <Typography variant='h6' align='center'>채팅방 번호</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography variant='h6' align='center'>채팅방 이름</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography variant='h6' align='center'>생성 일시</Typography>
    </Grid>
    <Grid item xs={3}>
      <Typography variant='h6' align='center'>참여자 수</Typography>
    </Grid>
  </Grid>
  );
};

export default ChatHeader;
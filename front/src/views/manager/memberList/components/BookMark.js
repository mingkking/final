import React, { useEffect, useContext } from 'react';
import { Typography, Grid, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';




const BookMark = () => {


  return (
            <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
              <Typography variant='h4' align='left' color="primary" style={{ marginBottom: '20px' }}>관심 목록</Typography>
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
                    <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
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
  );
};

export default BookMark;

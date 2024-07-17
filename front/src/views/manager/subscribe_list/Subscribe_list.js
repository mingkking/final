import React from 'react';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import { Typography } from '@mui/material';


const subscribe_list_page = () => {
  return (
    <PageContainer title="subscribe_list" description="this is Sample page">

      <DashboardCard title="subscribe_list">
        <Typography>구독리스트페이지여</Typography>

        <Typography>구독리스트페이지여</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default subscribe_list_page;


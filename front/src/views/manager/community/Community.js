import React from 'react';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import { Typography } from '@mui/material';


const subscribe_list_page = () => {
  return (
    <PageContainer title="Community" description="this is Sample page">

      <DashboardCard title="Community">
        <Typography>커뮤니티페이지여</Typography>

        <Typography>커뮤니티페이지여</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default subscribe_list_page;


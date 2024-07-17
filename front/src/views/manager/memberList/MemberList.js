import React from 'react';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import { Typography } from '@mui/material';


const Hgpage = () => {
  return (
    <PageContainer title="MemberList" description="this is Sample page">

      <DashboardCard title="MemberList">
        <Typography>멤버리스트페이지여</Typography>

        <Typography>멤버리스트페이지여</Typography>
      </DashboardCard>
    </PageContainer>
  );
};

export default Hgpage;


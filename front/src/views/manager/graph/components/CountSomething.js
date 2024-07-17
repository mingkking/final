import React from 'react';
import { Grid, Typography } from '@mui/material';

import DashboardCard from '../../../../components/shared/DashboardCard';



const MemberCount = ({title, count}) => {



  return (
    <div>
      <DashboardCard title={title}>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* column */}
          <Grid item xs={7} sm={7}>
            <Typography variant="h3" fontWeight="700" style={{ textAlign: 'center' }}>
              {count}
            </Typography>
          </Grid>
        </Grid>
      </DashboardCard>
    </div>
  );
};

export default MemberCount;



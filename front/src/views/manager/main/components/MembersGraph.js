import React, { useContext } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconHeart } from '@tabler/icons-react';

import DashboardCard from '../../../../components/shared/DashboardCard';
import mainContext from '../contexts/MainContext';



const MembersGraph = () => {

  const value = useContext(mainContext);

  // chart color
  const theme = useTheme();
  const memberColor = "#f3c2fc"
  const subscriberColor = "#91a9ff";

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [memberColor, subscriberColor],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = [20, 100]; // 구독자수, 회원수 넣기

  return (
    <div>
      <DashboardCard title="가입자수랑 회원수 비교">
        <Grid container spacing={3}>
          <Grid item xs={7} sm={7}>
            <Typography variant="h3" fontWeight="700">
              {/* 구독자수 넣기 */}
              {value.state.membersCount} 
            </Typography>
            <Stack direction="row" spacing={1} mt={1} alignItems="center">
              <Avatar sx={{ bgcolor: subscriberColor, width: 27, height: 27 }}>
                <IconHeart width={20} color="#f3c2fc" />
              </Avatar>
              <Typography variant="subtitle2" fontWeight="600">
                {/* 구독자수/회원수 퍼센트 넣기 */}
                9%
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                비율
              </Typography>
            </Stack>
            <Stack spacing={3} mt={5} direction="row">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{ width: 9, height: 9, bgcolor: memberColor, svg: { display: 'none' } }}
                ></Avatar>
                <Typography variant="subtitle2" color="textSecondary">
                  구독자수
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  sx={{ width: 9, height: 9, bgcolor: subscriberColor, svg: { display: 'none' } }}
                ></Avatar>
                <Typography variant="subtitle2" color="textSecondary">
                  회원수
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          {/* column */}
          <Grid item xs={5} sm={5}>
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="donut"
              height="150px"
            />
          </Grid>
        </Grid>
      </DashboardCard>
      </div>
  );
};

export default MembersGraph;

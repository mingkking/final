import React, { useContext, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import axios from 'axios';
import mainContext from '../../main/contexts/MainContext';

const YearJoinMembers = () => {

    const value = useContext(mainContext);

    // array.from 으로 간단하게 작성(최근 2년 회원가입수, 값이 없으면 0으로 설정)
    const data = Array.from({length: 2}, (_, i) => value.state.last2YearsMember[1-i]?.JOIN_COUNT ?? 0);

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

   // 최근 2년 계산 함수
   const getLastTwoYears = () => {
    const years = [];
    for (let i = 1; i >= 0; i--) {
        years.push(dayjs().subtract(i, 'year').format('YYYY년'));
    }
    return years;
    };

    // chart
    const optionscolumnchart = {
        chart: {
            type: 'bar',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        plotOptions: {
            bar: {
                horizontal: false,
                barHeight: '60%',
                columnWidth: '18%',
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all',
            },
        },

        stroke: {
            show: true,
            width: 5,
            lineCap: "butt",
            colors: ["transparent"],
          },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        grid: {
            borderColor: 'rgba(0,0,0,0.1)',
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },
        yaxis: {
            tickAmount: 4,
        },
        xaxis: {
            categories: getLastTwoYears(),
            axisBorder: {
                show: false,
            },
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };
    const seriescolumnchart = [
        {
            name: 'Total',
            data: [data[0], data[1]],
        },
    ];

    return (
        <div>
            <DashboardCard title="가입자 수(지난 2년)">
                <Chart
                    options={optionscolumnchart}
                    series={seriescolumnchart}
                    type="bar"
                    height="370px"
                />
            </DashboardCard>
        </div>
    );
};

export default YearJoinMembers;

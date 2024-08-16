import React, { useContext, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import mainContext from '../../main/contexts/MainContext';
import axios from 'axios';


const SalesOverview = () => {

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    const value = useContext(mainContext);

    // 최근 5일 계산 함수
    const getLastFiveDays = () => {
       return Array.from({ length: 5}, (_, i) => dayjs().subtract(i, 'day').format('D일')).reverse();
    };

    // days의 배열 값(8일, 9일...)과 springboot에서 받아온 값 매칭
    const getJoinCounts = (days, last5DaysMember) => {
        return days.map(day => {
            const member =last5DaysMember.find(item => item.JOIN_DATE === day);
            return member ? member.JOIN_COUNT : 0;
        })
    };
    
    const days = getLastFiveDays();
    const joinCounts = getJoinCounts(days, value.state.last5DaysMember);

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
                columnWidth: '42%',
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
            categories: getLastFiveDays(),
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
            data: joinCounts,
        },
    ];

    return (
        <div>
            <DashboardCard title="가입자 수(지난 5일)">
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

export default SalesOverview;

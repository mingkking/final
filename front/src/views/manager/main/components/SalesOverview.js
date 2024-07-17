import React from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';

const YearJoinMembers = () => {
    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // chart
    const optionscolumnchart = {
        chart: {
            type: 'line',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            },
            height: 370,
        },
        colors: [primary, secondary],
        stroke: {
            show: true,
            width: 2,
            lineCap: "butt",
            colors: ["#91a9ff", "#f3c2fc"],
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
            categories: ['1월','2월','3월','4월','5월','6월'],
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
            name: '가입자',
            data: [355, 500, 321, 214, 112, 251],
        },
        {
            name: '구독자',
            data: [280, 541, 245, 200, 100, 100],
        },
    ];

    return (
        <div>
            <DashboardCard title="가입자 / 구독자 수">
                <Chart
                    options={optionscolumnchart}
                    series={seriescolumnchart}
                    type="line"
                    height="370px"
                />
            </DashboardCard>
        </div>
    );
};

export default YearJoinMembers;

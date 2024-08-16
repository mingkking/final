import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import mainContext from "../contexts/MainContext";
import dayjs from 'dayjs';

const YearJoinMembers = () => {
    // chart color
    const theme = useTheme();
    const primary = '#91a9ff';
    const secondary = "#f3c2fc";
    const value = useContext(mainContext);

    // 최근 6개월 계산 함수
    const getLastSixMonths = () => {
        return Array.from({ length: 6 }, (_, i) => dayjs().subtract(i, 'month').format('M월')).reverse();
    };

    const getCounts = (months, count) => {
        return months.map(month => {
            const memCount = count.find(item => item.JOIN_MONTH === month);
            return memCount ? memCount.COUNT : 0;
        })
    };

    const months = getLastSixMonths();
    const subCount = getCounts(months, value.state.selectRecent6Sub);
    const memCount = getCounts(months, value.state.selectRecentMem);

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
            colors: [primary, secondary],
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
            categories: getLastSixMonths(),
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
            data: memCount,
        },
        {
            name: '구독자',
            data: subCount,
        },
    ];

    return (
        <div>
            <DashboardCard title="가입자 / 구독자 수 (최근 6개월)">
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

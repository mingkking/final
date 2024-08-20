import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import mainContext from '../../main/contexts/MainContext';

const YearJoinMembers = () => {
    // chart color
    const theme = useTheme();
    const primary = "#91a9ff";
    const secondary = "#f3c2fc";

    const value = useContext(mainContext);

    // 최근 6개월 계산 함수
    const getLastSixMonths = () => {
        return Array.from({ length: 6 }, (_, i) => dayjs().subtract(i, 'month').format('M월')).reverse();
    };

    const getSubCounts = (months, count) => {
        return months.map(month => {
            const subCount = count.find(item => item.JOIN_MONTH === month);
            return subCount ? subCount.COUNT : 0;
        })
    }

    const months = getLastSixMonths();
    const recent6SubCounts = getSubCounts(months, value.state.selectRecent6Sub);
    const lastYearSubCounts = getSubCounts(months, value.state.selectLastYearSub);

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
            name: '작년',
            data: lastYearSubCounts,
        },
        {
            name: '올해',
            data: recent6SubCounts,
        },
    ];

    return (
        <div>
            <DashboardCard title="구독자수(지난 6달 / 작년과 비교)">
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

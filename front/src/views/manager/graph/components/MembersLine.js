import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import mainContext from "../../main/contexts/MainContext";
import dayjs from 'dayjs';

const MembersLine = () => {

    // chart color
    const theme = useTheme();
    const primary = "#91a9ff";
    const secondary = "#f3c2fc";

    const value = useContext(mainContext);

    // 최근 6개월 계산 함수
    const getLastSixMonths = () => {
        const months = [];
        for (let i = 5; i >= 0; i--) {
            months.push(dayjs().subtract(i, 'month').format('M월'));
        }
        return months;
    };

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
            tickAmount: 5,
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
            name: 'last year',
            data: [355, 500, 321, 214, 112, 251],
        },
        {
            name: 'this year',
            data: [280, 541, 245, 200, 100, value.state.membersCount],
        },
    ];

    return (
        <div>
            <DashboardCard title="가입자수(지난 6달 / 작년과 비교)">
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

export default MembersLine;

import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import mainContext from '../../main/contexts/MainContext';


const MonthJoinMembers = () => {

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    const value = useContext(mainContext);

    // 최근 5개월의 월 이름을 반환하는 함수
    const getLastFiveMonths = () => {
        return Array.from({ length: 5 }, (_, i) => dayjs().subtract(i, 'month').format('M월')).reverse();
    };

    // months의 배열 값(8월, 9월...)과 springboot에서 받아온 값을 매칭
    const getJoinCounts = (months, last5MonthsMember) => {
        return months.map(month => {
            const member = last5MonthsMember.find(item => item.JOIN_MONTH === month);
            return member ? member.JOIN_COUNT : 0;
        });
    };

    const months = getLastFiveMonths(); // 최근 5개월 월 이름 배열
    const joinCounts = getJoinCounts(months, value.state.last5MonthsMember); // 차트에 넣을 데이터 값

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
            categories: getLastFiveMonths(),
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
            name: 'Month',
            data: joinCounts,
        },
    ];

    return (
        <div>
            <DashboardCard title="가입자 수(지난 5달)">
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

export default MonthJoinMembers;

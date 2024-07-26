import React, { useContext, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import dayjs from 'dayjs';
import axios from 'axios';
import mainContext from '../../main/contexts/MainContext';


const MonthJoinMembers = () => {

    const value = useContext(mainContext);

    // array.from 으로 간단하게 작성(최근 5일 회원가입수, 값이 없으면 0으로 설정)
    const data = Array.from({length: 5}, (_, i) => value.state.last5MonthsMember[4-i]?.JOIN_COUNT ?? 0);


    // SpringBoot 에서 selectLast5MonthsMember 값 가져와서 context파일에 저장하기
    useEffect(()=>{
      axios.get('http://localhost:8080')
      .then((result) => {
        value.actions.setLast5MonthsMember(result.data.selectLast5MonthsMember);
      });
    },[]);

    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

    // 최근 5개월 계산 함수
    const getLastFiveMonths = () => {
        const months = [];
        for (let i = 4; i >= 0; i--) {
            months.push(dayjs().subtract(i, 'month').format('M월'));
        }
        return months;
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
            data: [data[0], data[1], data[2], data[3], data[4]],
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

import React from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';


const SalesOverview = () => {


    // chart color
    const theme = useTheme();
    const primary = theme.palette.primary.main;
    const secondary = theme.palette.secondary.main;

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
            categories: [ '10', '11', '12', '13', '14'],
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
            data: [355, 200, 100, 20, 18],
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

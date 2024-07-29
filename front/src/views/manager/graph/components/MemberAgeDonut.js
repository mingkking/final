import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import mainContext from "../../main/contexts/MainContext";

const MemberAgeDonut = () => {
    // 차트 색상
    const theme = useTheme();
    const primary = "#91a9ff";
    const secondary = "#f3c2fc";

    const value = useContext(mainContext);

    // 차트 옵션
    const optionscolumnchart = {
        chart: {
            type: 'donut', // 도넛 차트로 설정
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            foreColor: '#adb0bb',
            toolbar: {
                show: true,
            }
        },
        colors: [primary, secondary, "#c2fcc3", "#fcc2ce", "#fcf6c2"], // 색상 지정하기
        dataLabels: {
            enabled: false,
        },
        labels: ["10대", "20대", "30대", "40대", "50대 이상"], // 연령대
        legend: {
            show: true,
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };

    // 차트 데이터
    const seriescolumnchart = ["10대", "20대", "30대", "40대", "50대 이상"].map(ageGroup => 
        value.state.countByAgeMember.find(item => item.AGE_GROUP === ageGroup)?.COUNT || 0
    );

    return (
        <div>
            <DashboardCard title="가입자 연령대">
                <Chart
                    options={optionscolumnchart}
                    series={seriescolumnchart}
                    type="donut"
                />
            </DashboardCard>
        </div>
    );
};

export default MemberAgeDonut;

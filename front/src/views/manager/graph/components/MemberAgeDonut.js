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
        colors: [primary, secondary, "#34a853", "#fbbc05", "#ea4335", "#4285f4"], // 색상 지정하기
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

    // 도넛 차트를 위한 데이터 형식
    const seriescolumnchart = [100, 200, 150, 80, value.state.membersCount]; // 예시 데이터

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

import React, { useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../../../../components/shared/DashboardCard';
import Chart from 'react-apexcharts';
import mainContext from "../../main/contexts/MainContext";

const MemberAgeDonut = () => {
    // 차트 색상
    const theme = useTheme();

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
        colors: ["#ff9c9c", "#ffc29c", "#fffc9c", "#b5ff9c", "#9cf8ff", "#9c9eff"], // 색상 지정하기
        dataLabels: {
            enabled: false,
        },
        labels: ["10대", "20대", "30대", "40대", "50대 이상", "구글 회원"], // 연령대
        legend: {
            show: true,
        },
        tooltip: {
            theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
            fillSeriesColor: false,
        },
    };

    // 차트 데이터
    const seriescolumnchart = ["10대", "20대", "30대", "40대", "50대 이상", "구글 회원"].map(ageGroup => 
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

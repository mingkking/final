import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import '../mainCss/Slick.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { styled } from '@mui/material/styles';

// CSS 스타일링된 슬라이드 컴포넌트
const StyledSlide = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.light,
    width: '100%',
    boxSizing: 'border-box',
}));

const CustomSlider = styled(Slider)(({ theme }) => ({
    '& .slick-slide': {
        margin: '0 10px', // 슬라이드 간의 간격 조절
    },
    '& .slick-track': {
        display: 'flex',
    },
}));

function MainList() {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 2, // 한 번에 2개의 슬라이드를 보여줍니다.
        slidesToScroll: 1, // 한 번에 1개의 슬라이드를 스크롤합니다.
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: false, // 가운데 맞춤 모드 비활성화
    };

    const DashboardItem = ({ title, items }) => (
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom color="primary.dark">{title}</Typography>
            <CustomSlider {...sliderSettings} style={{ width: '100%', overflow: 'hidden' }}>
                {items.map((item, index) => (
                    <StyledSlide key={index} elevation={1}>
                        <Typography variant="body1" color="text.secondary">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.money}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.percent}</Typography>
                    </StyledSlide>
                ))}
            </CustomSlider>
        </Paper>
    );

    return (
        <div>
            <Box sx={{ p: 2, bgcolor: 'secondary.light', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={3} sx={{ maxWidth: '650px', width: '100%' }}>
                    <Grid item xs={12}>
                        <DashboardItem
                            title="주요 주식"
                            items={[
                                { title: '삼성전자', money: '$425.24', percent: '3.61%' },
                                { title: 'SK하이닉스', money: '$169.11', percent: '2.30%' },
                                { title: '스타벅스', money: '$69.15', percent: '4.50%' },
                                { title: 'MSFT', money: '$342.81', percent: '2.64%' }
                            ]}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <DashboardItem
                            title="주요 부동산"
                            items={[
                                { title: '서울 아파트 이름', money: '해당 매물 주소', percent: '150,000,000' },
                                { title: '경기도 아파트 이름', money: '해당 매물 주소', percent: '2,100,000,000' },
                                { title: '대구 아파트 이름', money: '해당 매물 주소', percent: '2,400,000,000' },
                                { title: '부산 아파트 이름', money: '해당 매물 주소', percent: '20,100,000,000' }
                            ]}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'secondary.light', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={3} sx={{ maxWidth: '650px', width: '100%' }}>
                    <Grid item xs={12}>
                        <Paper elevation={4} sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
                            <Typography variant="h5" gutterBottom>실시간 뉴스</Typography>
                            <ul style={{ paddingLeft: '20px', margin: 0, listStyleType: 'disc' }}>
                                <li>주요 경제 뉴스 헤드라인 1</li>
                                <li>주요 경제 뉴스 헤드라인 2</li>
                                <li>주요 경제 뉴스 헤드라인 3</li>
                            </ul>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default MainList;

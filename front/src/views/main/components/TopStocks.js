import React from 'react';
import { Paper, Typography } from '@mui/material';
import Slider from 'react-slick';
import { styled } from '@mui/material/styles';
import { CustomSlider, StyledSlide } from './SliderStyles'; // 슬라이더 스타일을 정의한 파일에서 가져오기

const TopStocks = ({ stocks }) => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: false,
    };

    return (
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom color="primary.dark">주요 주식</Typography>
            <CustomSlider {...sliderSettings} style={{ width: '100%' }}>
                {stocks.map((stock, index) => (
                    <StyledSlide key={index} elevation={1}>
                        <Typography variant="body1" color="text.secondary">{stock.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{stock.money}</Typography>
                        <Typography variant="body2" color="text.secondary">{stock.percent}</Typography>
                    </StyledSlide>
                ))}
            </CustomSlider>
        </Paper>
    );
};

export default TopStocks;

import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { CustomSlider, StyledSlide } from './SliderStyles'; // 슬라이더 스타일을 정의한 파일에서 가져오기

const formatNumber = (number) => {
    if (number >= 10000 || number <= -10000) {
        return (number / 10000).toFixed(2) + '만';
    } else {
        return number.toFixed(2);
    }
};

const TopStocks = ({ stocks, onSlideClick }) => {
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
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, width: '100%', height:'200px', maxHeight: '300px', overflow: 'hidden' }}>
            <Typography variant="h4" gutterBottom color="primary.dark">인기 주식</Typography>
            <CustomSlider {...sliderSettings} style={{ width: '100%' }}>
                {stocks.map((stock, index) => (
                    <StyledSlide
                        key={index}
                        elevation={1}
                        onClick={() => onSlideClick(stock)}
                    >
                        <Box sx={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" color="text.primary">{stock.stockName}</Typography>
                        </Box>
                        <Box sx={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography 
                                variant="body2" 
                                color={stock.comparedPrice >= 0 ? 'success.main' : 'error.main'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                대비: {stock.comparedPrice >= 0 ? '+' : ''}{formatNumber(stock.comparedPrice)}
                            </Typography>
                        </Box>
                    </StyledSlide>
                ))}
            </CustomSlider>
        </Paper>
    );
};

export default TopStocks;

import React from 'react';
import { Paper, Typography, Box, useMediaQuery } from '@mui/material';
import { CustomSlider, StyledSlide } from './SliderStyles';

const formatNumber = (number) => {
    if (number === undefined || number === null || isNaN(number)) {
        return '0';
    }
    if (number >= 10000 || number <= -10000) {
        return (number / 10000).toFixed(2) + '만';
    } else {
        return number.toFixed(2);
    }
};



const TopStocks = ({ stocks, onSlideClick }) => {
    const isMobile = useMediaQuery('(max-width:360px)'); // 모바일 화면 크기 감지



    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: isMobile ? 1 : 2, // 모바일에서는 1개 슬라이드, 데스크탑에서는 2개 슬라이드
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: false,
    };


    return (

        <Paper elevation={3} sx={{ p: 2, bgcolor: '#1B1F2C', borderRadius: 2, width: '100%', height:'200px', maxHeight: '300px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom color="#fff">인기 주식</Typography>

            <CustomSlider {...sliderSettings} style={{ width: '100%' }}>
                {stocks.map((stock, index) => (
                    <StyledSlide
                        key={index}
                        elevation={1}
                        sx={{ height: '140px' }}
                        onClick={() => onSlideClick(stock)}
                    >
                        <Box sx={{ height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" color="#fff">{stock.stock_name}</Typography>
                        </Box>
                        <Box sx={{ height: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography 
                                variant="body2" 
                                color={stock.comparedPrice >= 0 ? 'success.main' : 'error.main'}
                                sx={{ fontWeight: 'bold' }}
                            >
                                대비: {stock.comparedPrice >= 0 ? '+' : ''}{formatNumber(stock.compared_price)}
                            </Typography>
                        </Box>
                     <Box sx={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="body1" color="text.primary">{stock.stock_name}</Typography>
                        </Box>
                        <Box sx={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography 
                            variant="body2" 
                            color={stock.comparedPrice >= 0 ? 'success.main' : 'error.main'}
                            sx={{ fontWeight: 'bold' }}
                        >
                            대비: {stock.comparedPrice >= 0 ? '+' : ''}{formatNumber(stock.compared_price)}
                        </Typography>
                        </Box>
                    </StyledSlide>
                ))}
            </CustomSlider>
        </Paper>
        </Paper>
    );
};

export default TopStocks;
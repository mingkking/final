import React from 'react';
import { Paper, Typography, Box,  useMediaQuery } from '@mui/material';
import { CustomSlider, StyledSlide } from './SliderStyles'; // 슬라이더 스타일을 정의한 파일에서 가져오기


// 숫자를 적절한 단위로 포맷팅하는 함수
const formatNumber = (number) => {
    if (number >= 100000000) { // 1억 이상
        const billions = Math.floor(number / 100000000); // 억 단위
        const millions = Math.floor((number % 100000000) / 10000000); // 천만 단위
        let result = '';
        
        if (billions > 0) result += `${billions}억 `;
        if (millions > 0) result += `${millions}천만`;

        return result.trim(); // 공백 제거
    } else if (number >= 10000) { // 1만 이상
        return number.toLocaleString(); // 천 단위로 쉼표 추가
    } else {
        return number.toLocaleString(); // 천 단위로 쉼표 추가
    }
};

const TopProperties = ({ properties, onSlideClick }) => {
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
        <Paper elevation={3} sx={{ p: 2, bgcolor: '#1B1F2C', borderRadius: 2, width: '100%', height: 'auto', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom color="#fff">인기 매물</Typography>
            <CustomSlider {...sliderSettings} style={{ width: '100%' }} sx={{
                '& .slick-prev, & .slick-next': {
                    display: 'none !important',
                }
            }}>
                {properties.map((property, index) => (
                    <StyledSlide
                        key={index}
                        elevation={1}
                        onClick={() => onSlideClick(property)}
                        sx={{
                            height: '140px',
                            padding: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            '@media (max-width:600px)': { // 모바일 화면에서 적용될 스타일
                                padding: '4px',
                            },
                            '@media (min-width:601px)': { // 데스크탑 화면에서 적용될 스타일
                                height: '140px',
                                padding: '8px',
                            }
                        }}
                    >
                        <Box sx={{height:'40px',mb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', color:'#1F2535' }}>
                            <Typography variant="body2" color="#fff" sx={{ textAlign: 'center', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{property.address}</Typography>
                        </Box>
                        <Box sx={{height:'40px',mb: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="body2" color="#fff" sx={{ textAlign: 'center', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>{property.apartMentName} {property.floorNumber} 층</Typography>
                        </Box>
                        <Box sx={{height:'40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.875rem', sm: '1rem' } }} variant="body2" color="#F1B13C">
                                {formatNumber(property.transactionAmount)}
                            </Typography>
                        </Box>
                    </StyledSlide>
                ))}
            </CustomSlider>
        </Paper>
    );
};

export default TopProperties;
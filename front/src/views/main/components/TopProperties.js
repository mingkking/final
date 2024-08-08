import React from 'react';
import { Paper, Typography } from '@mui/material';
import Slider from 'react-slick';
import { styled } from '@mui/material/styles';
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
            <Typography variant="h6" gutterBottom color="primary.dark">인기 매물</Typography>
            <CustomSlider {...sliderSettings} style={{ width: '100%' }}>
                {properties.map((property, index) => (
                    <StyledSlide
                        key={index}
                        elevation={1}
                        onClick={() => onSlideClick(property)}
                    >
                        <Typography variant="body1" color="text.secondary">{property.address}</Typography>
                        <Typography variant="body2" color="text.secondary">{property.apartMentName} {property.floorNumber}</Typography>
                        <Typography sx={{ fontWeight: 'bold' }} variant="body2" color="text.primary">{formatNumber(property.transactionAmount)}</Typography>
                    </StyledSlide>
                ))}
            </CustomSlider>
        </Paper>
    );
};

export default TopProperties;

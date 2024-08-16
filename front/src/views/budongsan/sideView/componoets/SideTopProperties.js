import React from 'react';
import { Paper, Typography } from '@mui/material';

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

const SideTopProperties = ({ properties, onPropertySelect }) => {
    return (
        <Paper elevation={3} sx={{ p: 2, bgcolor: '#202636', borderRadius: 2, width: '100%', maxHeight: '100%', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom color="#fff">인기 매물 Top 10</Typography>
            {properties.map((property, index) => (
                <Paper
                    key={index}
                    elevation={1}
                    sx={{ p: 1, mb: 1, cursor: 'pointer', backgroundColor:'#282E3C' }} // 스타일 속성 추가
                    onClick={() => onPropertySelect(property)} // 클릭 이벤트 핸들러 추가
                >
                    <Typography variant="body1" color="#fff">{property.address}</Typography>
                    <Typography variant="body2" color="#fff">{property.apartMentName} {property.floorNumber}층</Typography>
                    <Typography sx={{ fontWeight: 'bold' }} variant="body2" color="#fff">{formatNumber(property.transactionAmount)}</Typography>
                </Paper>
            ))}
        </Paper>
    );
};

export default SideTopProperties;

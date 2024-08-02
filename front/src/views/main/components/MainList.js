import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Tabs, Tab } from '@mui/material';
import Slider from 'react-slick';
import { styled } from '@mui/material/styles';
import axios from 'axios'; // Axios 추가
import '../mainCss/Slick.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../mainCss/MainList.css';

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


function MainList({onPropertySelect}) {
    const [tabValue, setTabValue] = useState(0);
    const [topProperties, setTopProperties] = useState([]);

    useEffect(() => {
        // 상위 5개의 부동산 정보를 가져오는 함수
        const fetchTopProperties = async () => {
            try {
                const response = await axios.get('http://localhost:5000/top-liked-properties');
                if (response.data.status === 'success') {
                    setTopProperties(response.data.topProperties);
                }
            } catch (error) {
                console.error('Error fetching top properties:', error);
            }
        };
        fetchTopProperties();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

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

    const handleSlideClick = (property) => {
        if (typeof onPropertySelect === 'function') {
            onPropertySelect(property);
            console.log('Selected Property:', property);
        } else {
            console.error('onPropertySelect is not a function');
        }
    };

    const DashboardItem = ({ title, items }) => (
        <Paper elevation={3} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, width: '100%', maxHeight: '300px', overflow: 'hidden' }}>
            <Typography variant="h6" gutterBottom color="primary.dark">{title}</Typography>
            <CustomSlider {...sliderSettings} style={{ width: '100%', overflow: 'hidden' }}>
                {items.map((item, index) => (
                    <StyledSlide key={index} elevation={1} onClick={() => handleSlideClick(item)}>
                        <Typography variant="body1" color="text.secondary">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">{item.money} {item.floorNumber}</Typography>
                        <Typography variant="body2" color="text.secondary">{formatNumber(item.percent)}</Typography>
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
                            items={topProperties.map(property => ({
                                title: property.address,
                                money: property.apartMentName,
                                floorNumber: property.floorNumber,
                                percent: property.transactionAmount
                            }))}
                        />
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ p: 2, bgcolor: 'secondary.light', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={3} sx={{ maxWidth: '650px', width: '100%' }}>
                    <Grid item xs={12}>
                        <Paper className="news-box">
                            <Typography className="news-header">실시간 뉴스</Typography>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="tabs example">
                                <Tab label="주식" />
                                <Tab label="부동산" />
                            </Tabs>
                            <div className="news-list-container">
                                {tabValue === 0 && (
                                    <>
                                        <ul className="news-list">
                                            <li className="news-list-item">주식 뉴스 헤드라인 1</li>
                                            <li className="news-list-item">주식 뉴스 헤드라인 2</li>
                                            <li className="news-list-item">주식 뉴스 헤드라인 3</li>
                                            <li className="news-list-item">주식 뉴스 헤드라인 4</li>
                                            <li className="news-list-item">주식 뉴스 헤드라인 5</li>
                                            {/* 추가 뉴스 항목 */}
                                        </ul>
                                    </>
                                )}
                                {tabValue === 1 && (
                                    <>
                                        <ul className="news-list">
                                            <li className="news-list-item">부동산 뉴스 헤드라인 1</li>
                                            <li className="news-list-item">부동산 뉴스 헤드라인 2</li>
                                            <li className="news-list-item">부동산 뉴스 헤드라인 3</li>
                                            <li className="news-list-item">부동산 뉴스 헤드라인 4</li>
                                            <li className="news-list-item">부동산 뉴스 헤드라인 5</li>
                                            {/* 추가 뉴스 항목 */}
                                        </ul>
                                    </>
                                )}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default MainList;

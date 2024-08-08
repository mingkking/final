import React, { useState, useEffect } from 'react';
import { Grid, Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import axios from 'axios';
import TopStocks from './TopStocks';
import TopProperties from './TopProperties';
import PropertyModal from './PropertyModal';
import '../mainCss/Slick.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../mainCss/MainList.css';

function MainList() {
    const [tabValue, setTabValue] = useState(0);
    const [topProperties, setTopProperties] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
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

    useEffect(() => {
        const fetchStockList = async () => {
            try {
                const response = await axios.get("http://localhost:8080/MainstockList");
                setStockList(response.data);
            } catch (error) {
                console.log("Error fetching stocks", error);
            }
        };
        fetchStockList();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSlideClick = (property) => {
        setSelectedProperty(property);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProperty(null);
    };

    return (
        <div>
            <Box sx={{ p: 2, bgcolor: 'secondary.light', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={3} sx={{ maxWidth: '650px', width: '100%' }}>
                    <Grid item xs={12}>
                        <TopStocks stocks={stockList} />
                    </Grid>
                    <Grid item xs={12}>
                        <TopProperties
                            properties={topProperties.map(property => ({
                                address: property.address,
                                apartMentName: property.apartMentName,
                                floorNumber: property.floorNumber,
                                transactionAmount: property.transactionAmount,
                                yearBuilt: property.yearBuilt,
                                registrationDate: property.registrationDate,
                                squareFootage: property.squareFootage,
                                road_name: property.roadName,
                            }))}
                            onSlideClick={handleSlideClick}
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
                                    <ul className="news-list">
                                        <li className="news-list-item">주식 뉴스 헤드라인 1</li>
                                        <li className="news-list-item">주식 뉴스 헤드라인 2</li>
                                        <li className="news-list-item">주식 뉴스 헤드라인 3</li>
                                        <li className="news-list-item">주식 뉴스 헤드라인 4</li>
                                        <li className="news-list-item">주식 뉴스 헤드라인 5</li>
                                    </ul>
                                )}
                                {tabValue === 1 && (
                                    <ul className="news-list">
                                        <li className="news-list-item">부동산 뉴스 헤드라인 1</li>
                                        <li className="news-list-item">부동산 뉴스 헤드라인 2</li>
                                        <li className="news-list-item">부동산 뉴스 헤드라인 3</li>
                                        <li className="news-list-item">부동산 뉴스 헤드라인 4</li>
                                        <li className="news-list-item">부동산 뉴스 헤드라인 5</li>
                                    </ul>
                                )}
                            </div>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {selectedProperty && (
                <PropertyModal
                    open={modalOpen}
                    handleClose={handleModalClose}
                    property={selectedProperty}
                />
            )}
        </div>
    );
}

export default MainList;

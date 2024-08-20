import React, { useState, useEffect } from 'react';
import { Grid, Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import axios from 'axios';
import TopStocks from './TopStocks';
import TopProperties from './TopProperties';
import PropertyModal from './PropertyModal';
import StockModal from './StockModal';
import '../mainCss/Slick.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../mainCss/MainList.css';

function MainList() {
    const [tabValue, setTabValue] = useState(0);
    const [topProperties, setTopProperties] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedStock, setSelectedStock] = useState(null);
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
                if(response.data.status === 'success'){
                    setStockList(response.data);
                }
            } catch (error) {
                console.log("Error fetching stocks", error);
            }
        };
        fetchStockList();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    // 주식 modal 핸들 이벤트
    const stockHandleSlideClick = (stock) =>{
        console.log(stock)
        setSelectedStock(stock);
        setModalOpen(true);
    }
    const stockHandleModalClose = () =>{
        setModalOpen(false);
        setSelectedStock(null);
    }

    //부동산 modal 핸들 이벤트
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
            <Box sx={{ p: 2, width: '100%', height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Grid container spacing={3} sx={{ maxWidth: '650px', width: '100%', height: '600px' }}>
                    <Grid item xs={12}>
                        <TopStocks stocks={stockList}
                        onSlideClick={stockHandleSlideClick} />
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

            {selectedProperty && (
                <PropertyModal
                    open={modalOpen}
                    handleClose={handleModalClose}
                    property={selectedProperty}
                />
            )}

            {selectedStock && (
                <StockModal
                    open={modalOpen}
                    handleClose={stockHandleModalClose}
                    stock={selectedStock}
                />
            )}
        </div>
    );
}

export default MainList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SideTopProperties from './componoets/SideTopProperties';
import { Grid, Box } from '@mui/material';
import './sideCss/SideLike.css'

const SideLike = ({ onPropertySelect }) => {
    const [topProperties, setTopProperties] = useState([]);    

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

    return (
        <div className="scrollableLike-container">
            <Box 
                sx={{ 
                    p: 2, 
                    bgcolor: '#131722', 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                }}
            >
                <Grid container spacing={3} sx={{ maxWidth: '650px', width: '100%' }}>
                    <Grid item xs={12}>
                        <SideTopProperties 
                            properties={topProperties.map(property => ({
                                address: property.address,
                                apartMentName: property.apartMentName,
                                floorNumber: property.floorNumber,
                                transactionAmount: property.transactionAmount,
                                yearBuilt: property.yearBuilt,
                                registrationDate: property.registrationDate,
                                squareFootage: property.squareFootage,
                                road_name: property.roadName,
                                property_num: property.property_num,
                            }))}
                            onPropertySelect={onPropertySelect} // onPropertySelect 함수 전달
                        />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}

export default SideLike;

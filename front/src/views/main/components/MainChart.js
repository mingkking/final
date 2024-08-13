import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';

function MainChart() {
    const [kospiData, setKospiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [latestDate, setLatestDate] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
        const fetchKospiData = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:8080/kospi");
                console.log("Received data:", response.data);
                setKospiData(response.data);
                
                if (response.data.length > 0) {
                    const dates = response.data.map(item => new Date(item.recordDate || item.record_date));
                    const maxDate = new Date(Math.max.apply(null, dates));
                    setLatestDate(maxDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }));
                }
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching KOSPI data", error);
                setError("KOSPI 데이터를 불러오는 데 실패했습니다.");
                setLoading(false);
            }
        };
        fetchKospiData();
    }, []);

    if (loading) return <Typography align="center">로딩 중...</Typography>;
    if (error) return <Typography align="center" color="error">{error}</Typography>;
    if (kospiData.length === 0) return <Typography align="center">데이터가 없습니다.</Typography>;

    const latestKospi = kospiData[kospiData.length - 1];

    return (
        <Paper elevation={3} sx={{ p: isMobile ? 2 : 3, borderRadius: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ mb: isMobile ? 2 : 4 }}>
                <Typography variant={isMobile ? "h5" : "h4"} component="h1" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
                    코스피지수
                </Typography>
                {latestKospi && (
                    <Typography 
                        variant={isMobile ? "h4" : "h3"}
                        align="center" 
                        sx={{ 
                            fontWeight: "bold",
                            color: theme.palette.error.main,
                        }}
                    >
                        {latestKospi.closingPrice || latestKospi.closing_price}
                    </Typography>
                )}
                <Typography 
                    variant="subtitle1" 
                    align="center" 
                    sx={{ 
                        color: 'text.secondary',
                        fontWeight: "normal",
                        fontSize: isMobile ? '0.8rem' : '0.9rem',
                    }}
                >
                    {latestDate} 기준
                </Typography>
            </Box>
            <Box sx={{ height: isMobile ? 300 : 400, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={kospiData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="recordDate" 
                            angle={-45} 
                            textAnchor="end" 
                            height={70} 
                            tick={{fontSize: isMobile ? 8 : 10}}
                            interval={isMobile ? 'preserveStartEnd' : 0}
                        />
                        <YAxis />
                        <Tooltip />
                        <Area 
                            type="monotone" 
                            dataKey="closingPrice" 
                            stroke={theme.palette.error.main} 
                            fill={theme.palette.error.light} 
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}

export default MainChart;
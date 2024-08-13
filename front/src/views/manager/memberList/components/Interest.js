import React, { useEffect, useState } from 'react';
import { Typography, Grid, Pagination } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Interest = () => {
  const { user_num } = useParams();
  const [interestEstate, setInterestEstate] = useState([]);
  const interestPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentInterest, setCurrentInterest] = useState([]);

  useEffect(() => {
    const getInterestEstate = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        setInterestEstate(response.data.interestEstate);
      } catch (error) {
        console.error("Error fetching bookmarks: ", error);
      }
    };

    getInterestEstate();
  }, [user_num]);

  useEffect(() => {
    const indexOfLastPost = currentPage * interestPerPage;
    const indexOfFirstPost = indexOfLastPost - interestPerPage;
    setCurrentInterest(interestEstate.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentInterest, interestEstate, interestPerPage]);

  const paginate = (event, pageNumber) => setCurrentPage(pageNumber);

  return (
    <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
      <Typography variant='h4' align='left' color="primary" style={{ marginBottom: '20px' }}>관심 목록</Typography>
        <DashboardCard>
          <Grid container spacing={2}>
            <Grid item sm={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>분류</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="h5" sx={{ mb: 2 }}>항목</Typography>
            </Grid>
          </Grid>
          <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
          <Grid container spacing={2}>
            {interestEstate.length === 0 ? (
              <Grid item sm={12}>
                <Typography>관심 목록 없음</Typography>
              </Grid>
            ) : (
              interestEstate.map((interest, index) => {

              return(
                <React.Fragment key={index}>
                  <Grid item sm={6}>
                    <Typography>부동산</Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography>{interest.apartment_name}</Typography>
                  </Grid>
                </React.Fragment>
              )
            })
          )}
        </Grid>
        {/* 페이지네이션 */}
        {interestEstate.length > 3 && (
          <Pagination
            count={Math.ceil(interestEstate.length / interestPerPage)}
              page={currentPage}
              onChange={paginate}
              color="primary"
              style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
            />
          )}
      </DashboardCard>
    </Grid>
  );
};

export default Interest;

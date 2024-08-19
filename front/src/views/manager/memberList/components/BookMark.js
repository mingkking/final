import React, { useEffect, useContext, useState } from 'react';
import { Typography, Grid, Pagination } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';




const BookMark = () => {

  const { user_num } = useParams();
  const [bookMark, setBookMark] = useState([]);
  const bookMarkPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [currentBookMartk, setCurrentBookMark] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getBookMark = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        console.log("bookmark값: ", response.data.selectBookMark)
        setBookMark(response.data.selectBookMark);
      }catch (error) {
        console.error("BookMark.js 8행 에러: ", error);
      }
    };
    getBookMark();
  }, []);

  useEffect(() => {
    const indexOfLastPost = currentPage * bookMarkPerPage;
    const indexOfFirstPost = indexOfLastPost - bookMarkPerPage;
    setCurrentBookMark(bookMark.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentPage, bookMark, bookMarkPerPage]);

  const paginate = (event, pageNumber) => setCurrentPage(pageNumber);

  const handleClickBookMark = (id) => {
    navigate(`/DetailCommunity?id=${id}`)
  }


  return (
            <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
              <Typography variant='h4' align='left' color="primary" style={{ marginBottom: '20px' }}>커뮤니티 북마크</Typography>
              <DashboardCard>
              <Grid container spacing={4}>
                <Grid item sm={3}>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>글 번호</Typography>
                </Grid>
                <Grid item sm={3}>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>글 제목</Typography>
                </Grid>
                <Grid item sm={3}>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>글 내용</Typography>
                </Grid>
                <Grid item sm={3}>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>조회수</Typography>
                </Grid>
              </Grid>
                <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
                <Grid container spacing={4}>
                  {currentBookMartk.length === 0 ? (
                        <Grid item sm={12}>
                        <Typography>북마크 없음</Typography>
                      </Grid>
                  ) : (
                    currentBookMartk.map((bookMark, index) => {
                  // 제목과 내용이 글자수가 6글자 이상일 시 자르고 ... 으로 처리
                    const truncateText = (text, length) => {
                      return text.length > length ? text.slice(0, length) + "..." : text;
                    };

                    return (
                      <React.Fragment key={index}>
                        <Grid container item sm={12} style={{ cursor: 'pointer' }} onClick={() => handleClickBookMark(bookMark.id)}>
                          <Grid item sm={3}>
                            <Typography>{bookMark.id}</Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <Typography>{truncateText(bookMark.title, 6)}</Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <Typography>{truncateText(bookMark.contents, 6)}</Typography>
                          </Grid>
                          <Grid item sm={3}>
                            <Typography>{bookMark.view_count}</Typography>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    );
                  })
                )}
                </Grid>
                {/* 페이지네이션 */}
                {bookMark.length > 3 && (
                  <Pagination
                    count={Math.ceil(bookMark.length / bookMarkPerPage)}
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

export default BookMark;

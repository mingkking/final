import React, { useEffect, useState } from 'react';
import { Typography, Grid, Pagination } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookMark = () => {
  const { user_num } = useParams();
  const [commPost, setCommPost] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPosts, setCurrentPosts] = useState([]);
  const postsPerPage = 3;
  const navigate = useNavigate();

  // springboot에서 데이터 받아오기
  useEffect(() => {
    const getCommPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        setCommPost(response.data.commPost);
      } catch (error) {
        console.error("CommPost.js 에러: ", error);
      }
    };
    getCommPost();
  }, [user_num]);

  // 페이징
  useEffect(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    setCurrentPosts(commPost.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentPage, commPost, postsPerPage]);

  const paginate = (event, pageNumber) => setCurrentPage(pageNumber);

  // 텍스트 자르기
  const truncateText = (text, length) => {
    return text.length > length ? text.slice(0, length) + "..." : text;
  };

  // 상세페이지로 이동
  const handleClickCommPost = (id) => {
    navigate(`/DetailCommunity?id=${id}`);
  }

  return (
    <Grid item sm={12}>
      <Typography variant='h4' align='left' color="primary" style={{ marginBottom: '20px' }}>글 작성 목록</Typography>
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
          {currentPosts.length === 0 ? (
            <Grid item sm={12}>
              <Typography>작성 글 없음</Typography>
            </Grid>
          ) : (
            currentPosts.map((post, index) => (
              <React.Fragment key={index}>
                <Grid container item sm={12} style={{ cursor: 'pointer' }} onClick={() => handleClickCommPost(post.id)}>
                  <Grid item sm={3} >
                    <Typography>{post.id}</Typography>
                  </Grid>
                  <Grid item sm={3}>
                    <Typography>{truncateText(post.title, 6)}</Typography>
                  </Grid>
                  <Grid item sm={3}>
                    <Typography>{truncateText(post.contents, 6)}</Typography>
                  </Grid>
                  <Grid item sm={3}>
                    <Typography>{post.view_count}</Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))
          )}
        </Grid>
        {commPost.length > 3 && (
          <Pagination
            count={Math.ceil(commPost.length / postsPerPage)}
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
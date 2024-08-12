import React, { useEffect, useContext, useState } from 'react';
import { Typography, Grid, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';


const BookMark = () => {
  const { user_num } = useParams();
  const [commPost, setCommPost] = useState("");

  useEffect(() => {
    const getCommPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        setCommPost(response.data.commPost);

      } catch (error) {
        console.error("CommPost.js 17행 에러: ", error);
      }
  };
  getCommPost();
  }, []);


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
        {commPost.length === 0 ? (
              <Grid item sm={12}>
              <Typography>작성 글 없음</Typography>
            </Grid>
        ) : (
        commPost.map((post, index) => {
        // 제목과 내용이 글자수가 6글자 이상일 시 자르고 ... 으로 처리
          const truncateText = (text, length) => {
            return text.length > length ? text.slice(0, length) + "..." : text;
          };

          return (
            <React.Fragment key={index}>
              <Grid item sm={3}>
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
            </React.Fragment>
          );
        })
      )}
      </Grid>
    </DashboardCard>
  </Grid>
  );
};

export default BookMark;

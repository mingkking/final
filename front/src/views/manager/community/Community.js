import React, { useState, useEffect } from 'react';
import { Typography, Grid, Pagination } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import PostGrid from './components/PostGrid';
import axios from 'axios';

const MemberList = () => {
  const [posts, setPosts] = useState([]);
  const postsPerPage = 16; // 페이지당 포스트 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지

  // springboot에서 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/manager/community')
      .then((result) => {
        setPosts(result.data.selectCommPostAll);
      })
  }, []);

  // 페이지 변경 함수
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 현재 페이지에 해당하는 포스트들을 계산
  const indexOfLastPost = currentPage * postsPerPage; // 마지막 게시물
  const indexOfFirstPost = indexOfLastPost - postsPerPage; // 첫 번째 게시물
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // 페이지에 맞게 데이터 자르기

  return (
    <PageContainer title="회원 목록" description="회원 목록을 확인합니다.">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard>
            <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginTop: '30px', marginBottom: '60px' }}>커뮤니티 글 목록</Typography>
            
            {/* 분류선 */}
            <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} /> 

            <PostGrid posts={currentPosts} />
            
            {/* 페이지 네비게이션 */}
            <Pagination
              count={Math.ceil(posts.length / postsPerPage)} // 총 페이지 수 계산
              page={currentPage} // 현재 페이지 설정
              onChange={handlePageChange}
              color="primary"
              style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
            />
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MemberList;
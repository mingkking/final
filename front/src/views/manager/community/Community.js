// 0805 오전 10시 7분
// 제목 제외 필터 걸고 검색하면 에러남
// 글쓴사람이랑 내용도 추가해야 할듯? -> 필터링이랑, 화면출력에

import React, { useState, useEffect } from 'react';
import { Typography, Grid, Pagination, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import PostGrid from './components/PostGrid';
import axios from 'axios';

const MemberList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const postsPerPage = 16; // 페이지당 포스트 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [searchPost, setSearchPost] = useState(''); // 검색어
  const [searchField, setSearchField] = useState('title'); // 검색 필드

  // springboot에서 데이터 가져오기
  useEffect(() => {
    axios.get('http://localhost:8080/manager/community')
      .then((result) => {
        setPosts(result.data.selectCommPostAll);
        setFilteredPosts(result.data.selectCommPostAll);
      })
  }, []);

  // 페이지 변경 함수
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  // 검색어 변경 함수
  const handleSearchChange = (event) => {
    setSearchPost(event.target.value);
  };

  // 검색 드롭다운 변경 함수
  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchPost(''); // 드롭다운이 변경될 때 검색어 초기화
    setFilteredPosts(posts); // 전체 리스트로 초기화
    setCurrentPage(1); // 페이지가 1로 되도록 설정
  };

  // 검색 버튼 클릭 함수
  const handleSearchBtn = () => {
    const updateFilteredPosts = posts.filter((post) => 
      post[searchField].toString().toLowerCase().includes(searchPost.toLowerCase())
    );
    setFilteredPosts(updateFilteredPosts); // 포스트 목록에 검색한 데이터 넣기
    setCurrentPage(1); // 검색하면 페이지가 1로 되도록 설정
  };

  // 현재 페이지에 해당하는 포스트들을 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <PageContainer title="회원 목록" description="회원 목록을 확인합니다.">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard>
            <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>커뮤니티 글 목록</Typography>
            
            {/* 검색 기능 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '10px' }}>
                <InputLabel>필터</InputLabel>
                <Select
                  value={searchField}
                  onChange={handleSearchFieldChange}
                  label="필터"
                  size='small'
                >
                  <MenuItem value="title">제목</MenuItem>
                  <MenuItem value="post_num">글번호</MenuItem>
                  <MenuItem value="content">내용</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="검색"
                variant="outlined"
                size="small"
                value={searchPost}
                onChange={handleSearchChange}
                style={{ marginRight: '10px' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearchBtn}
              >
                검색
              </Button>
            </div>

            {/* 분류선 */}
            <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} /> 

            <PostGrid posts={currentPosts} />
            
            {/* 페이지 네비게이션 */}
            <Pagination
              count={Math.ceil(filteredPosts.length / postsPerPage)}
              page={currentPage}
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
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Pagination, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import PostGrid from './components/PostGrid';
import axios from 'axios';

const CommunityList = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const postsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPost, setSearchPost] = useState('');
  const [searchField, setSearchField] = useState('title');
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    axios.get('http://localhost:8080/manager/community')
      .then((result) => {
        const sortedPosts = result.data.selectCommPostAll.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);
      })
  }, []);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event) => {
    setSearchPost(event.target.value);
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchPost('');
    setFilteredPosts(posts);
    setCurrentPage(1);
  };

  const handleSearchBtn = () => {
    const updateFilteredPosts = posts.filter((post) => 
      post[searchField].toString().toLowerCase().includes(searchPost.toLowerCase())
    );
    setFilteredPosts(updateFilteredPosts);
    setCurrentPage(1);
  };

  const handleSort = () => {
    const sortedPosts = [...filteredPosts].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredPosts(sortedPosts);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSort();
  }, [sortField, sortOrder]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <PageContainer title="커뮤니티 관리" description="커뮤니티 관리 페이지">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard>
            <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>커뮤니티 글 목록</Typography>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              {/* 정렬 기능 */}
              <div style={{ display: 'flex' }}>
                <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '10px' }}>
                  <InputLabel>정렬 기준</InputLabel>
                  <Select
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    label="정렬 기준"
                    size='small'
                  >
                    <MenuItem value="created_at">작성일</MenuItem>
                    <MenuItem value="title">제목</MenuItem>
                    <MenuItem value="user_name">작성자</MenuItem>
                    <MenuItem value="id">글번호</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '10px' }}>
                  <InputLabel>정렬 순서</InputLabel>
                  <Select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    label="정렬 순서"
                    size='small'
                  >
                    <MenuItem value="asc">오름차순</MenuItem>
                    <MenuItem value="desc">내림차순</MenuItem>
                  </Select>
                </FormControl>
              </div>
              
              {/* 검색 기능 */}
              <div style={{ display: 'flex' }}>
                <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '10px' }}>
                  <InputLabel>필터</InputLabel>
                  <Select
                    value={searchField}
                    onChange={handleSearchFieldChange}
                    label="필터"
                    size='small'
                  >
                    <MenuItem value="title">제목</MenuItem>
                    <MenuItem value="id">글번호</MenuItem>
                    <MenuItem value="contents">내용</MenuItem>
                    <MenuItem value="created_at">작성일</MenuItem>
                    <MenuItem value="user_name">작성자</MenuItem>
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
            </div>

            {/* 분류선 */}
            <div style={{ borderBottom: '1px solid #c9c9c9', marginTop: '20px', marginBottom: '20px' }} /> 

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

export default CommunityList;
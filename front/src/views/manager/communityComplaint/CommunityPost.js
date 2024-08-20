import React, { useState, useEffect } from 'react';
import { Typography, Grid, Pagination, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import BlankCard from '../../../components/shared/BlankCard';
import axios from 'axios';
import Header from './components/CommComplaintHeader';

const CommDecPost = () => {
  const [commPostComplaint, setCommPostComplaint] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [postsPerPage] = useState(10);  // 페이지 당 게시글 수
  const [searchField, setSearchField] = useState('user_num');  // 검색 필드
  const [searchValue, setSearchValue] = useState('');  // 검색 값
  const [sortField, setSortField] = useState('user_num');  // 정렬 기준
  const [sortOrder, setSortOrder] = useState('asc');  // 정렬 순서
  const navigate = useNavigate();

  const handleClickDetail = (id) => {
    navigate(`/manager/complaint/commPostDetail/${id}`);    
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchBtn = () => {
    filterAndSortPosts();
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchValue('');
    filterAndSortPosts();
  };

  const handleSortFieldChange = (event) => {
    setSortField(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
  };

  const filterAndSortPosts = () => {
    // 필터링
    const filtered = commPostComplaint.filter((post) => 
      post[searchField]?.toString().toLowerCase().includes(searchValue.toLowerCase())
    );

    // 정렬
    const sortedPosts = filtered.sort((a, b) => {
      if (sortField === 'created_at') {
        return sortOrder === 'asc'
          ? new Date(a[sortField]) - new Date(b[sortField])
          : new Date(b[sortField]) - new Date(a[sortField]);
      } else if (sortField === 'user_num') {
        return sortOrder === 'asc'
        ? parseInt(a[sortField] || '0') - parseInt(b[sortField] || '0')
        : parseInt(b[sortField] || '0') - parseInt(a[sortField] || '0');
      } else {
        return sortOrder === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

    setFilteredPosts(sortedPosts);
    setPage(1);
  };

  useEffect(() => {
    axios.get('http://localhost:8080/manager/complaint/communityPost')
      .then((result) => {
        setCommPostComplaint(result.data.selectCommPostComplaint);
        setFilteredPosts(result.data.selectCommPostComplaint);
      });
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [sortField, sortOrder]);

  const indexLastPost = page * postsPerPage;
  const indexFirstPost = indexLastPost - postsPerPage;
  const slicePosts = filteredPosts.slice(indexFirstPost, indexLastPost);

  const sliceText = (text) => {
    return text.length > 7 ? text.slice(0, 9) + "..." : text;
  };

  return (
    <PageContainer title="커뮤니티 게시글 신고 관리" description="커뮤니티 게시글 신고 관리">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard>
            <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
              커뮤니티 게시글 신고 목록
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              {/* 정렬 기능 */}
              <div style={{ display: 'flex' }}>
                <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '10px' }}>
                  <InputLabel>정렬 기준</InputLabel>
                  <Select
                    value={sortField}
                    onChange={handleSortFieldChange}
                    label="정렬 기준"
                    size='small'
                  >
                    <MenuItem value="user_num">회원번호</MenuItem>
                    <MenuItem value="user_name">회원명</MenuItem>
                    <MenuItem value="created_at">신고일자</MenuItem>
                    <MenuItem value="title">게시글 제목</MenuItem>
                  </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '10px' }}>
                  <InputLabel>정렬 순서</InputLabel>
                  <Select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
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
                  <InputLabel>검색 필드</InputLabel>
                  <Select
                    value={searchField}
                    onChange={handleSearchFieldChange}
                    label="검색 필드"
                    size='small'
                  >
                    <MenuItem value="user_num">회원번호</MenuItem>
                    <MenuItem value="user_name">회원명</MenuItem>
                    <MenuItem value="title">게시글 제목</MenuItem>
                    <MenuItem value="content">신고 내용</MenuItem>
                    <MenuItem value="created_at">신고 일자</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="검색"
                  variant="outlined"
                  size="small"
                  value={searchValue}
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
            
            <Header />

            {/* 분류선 */}
            <div style={{ borderBottom: '1px solid #c9c9c9', marginTop: '20px', marginBottom: '20px' }} />

            {/* 커뮤니티 게시글 리스트 */}
            <Grid container spacing={3}>
              {slicePosts.map((post, index) => (
                <Grid item xs={12} key={index} style={{ cursor: 'pointer', marginBottom: '5px' }}  onClick={() => handleClickDetail(post.id)}>
                  <BlankCard>
                    <Grid container spacing={3} style={{ paddingTop: '30px', paddingBottom: '30px' }} >
                    <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{post.user_num}</Typography>
                      </Grid>                      
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{post.user_name}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h6' align='center'>{sliceText(post.title)}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography variant='h6' align='center'>{post.content}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{post.created_at}</Typography>
                      </Grid>
                    </Grid>
                  </BlankCard>
                </Grid>
              ))}
            </Grid>

            {/* 페이지 네비게이션 */}
            <Pagination
              count={Math.ceil(filteredPosts.length / postsPerPage)}
              page={page}
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

export default CommDecPost;

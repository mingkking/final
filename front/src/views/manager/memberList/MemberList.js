import React, { useContext, useState, useEffect } from 'react';
import { Typography, Grid, Pagination, TextField, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import BlankCard from '../../../components/shared/BlankCard';
import mainContext from "../main/contexts/MainContext";
import axios from 'axios';
import Header from './components/MemberListHeader'

const MemberList = () => {
  const value = useContext(mainContext);
  const member10List = 10;
  const [pageTen, setPageTen] = useState(1);
  const [searchMember, setSearchMember] = useState('');
  const [searchField, setSearchField] = useState('user_name');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [sortField, setSortField] = useState('user_num');
  const [sortOrder, setSortOrder] = useState('asc');
  const [hasPaymentDate, setHasPaymentDate] = useState(false);  // 체크박스 상태
  const navigate = useNavigate();

  const handleClickDetail = (user_num) => {
    navigate(`/manager/memberDetail/${user_num}`);    
  }

  const handlePageChange = (event, page) => {
    setPageTen(page);
  };

  const handleSearchChange = (event) => {
    setSearchMember(event.target.value);
  };

  const handleSearchBtn = () => {
    filterAndSortMembers();
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchMember('');
    filterAndSortMembers();
  };

  const filterAndSortMembers = () => {
    // 필터링
    const filtered = value.state.memberList.filter((member) => {
      const matchesSearch = member[searchField].toString().toLowerCase().includes(searchMember.toLowerCase());
      const hasPayment = !hasPaymentDate || (member.payment_date && member.payment_date.trim() !== '');
      return matchesSearch && hasPayment;
    });

    // 정렬
    const sortedMembers = filtered.sort((a, b) => {
      if (sortField === 'user_num') {
        return sortOrder === 'asc' 
          ? parseInt(a[sortField]) - parseInt(b[sortField])
          : parseInt(b[sortField]) - parseInt(a[sortField]);
      } else if (sortField === 'created_at' || sortField === 'payment_date') {
        return sortOrder === 'asc'
          ? new Date(a[sortField]) - new Date(b[sortField])
          : new Date(b[sortField]) - new Date(a[sortField]);
      } else {
        return sortOrder === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

    setFilteredMembers(sortedMembers);
    setPageTen(1);
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 멤버 리스트를 로드합니다.
    axios.get('http://localhost:8080/manager/memberList')
      .then((result) => {
        console.log(result);
        const initialSortedList = result.data.selectMemberList.sort((a, b) => 
          parseInt(a.user_num) - parseInt(b.user_num)
        );
        value.actions.setMemberList(initialSortedList);
        setFilteredMembers(initialSortedList);
      });
  }, []);

  // 체크박스 상태 변경 시 필터링 및 정렬
  useEffect(() => {
    filterAndSortMembers();
  }, [hasPaymentDate]);

  // 검색 필드, 검색 값 또는 정렬 기준 변경 시 필터링 및 정렬
  useEffect(() => {
    filterAndSortMembers(); 
  }, [searchField, searchMember, sortField, sortOrder]);

  const indexLastMember = pageTen * member10List;
  const indexFirstMember = indexLastMember - member10List;
  const sliceMembers = filteredMembers.slice(indexFirstMember, indexLastMember);

  return (
    <PageContainer title="회원" description="회원">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard>
            <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>회원 목록</Typography>
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
                    <MenuItem value="user_num">회원번호</MenuItem>
                    <MenuItem value="user_name">이름</MenuItem>
                    <MenuItem value="user_nickname">닉네임</MenuItem>
                    <MenuItem value="created_at">가입일자</MenuItem>
                    <MenuItem value="payment_date">구독일시</MenuItem>
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

              
              {/* 구독 체크박스 추가 */}
              <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px'}}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={hasPaymentDate}
                      onChange={(e) => setHasPaymentDate(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="구독 회원"
                />
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
                    <MenuItem value="user_name">이름</MenuItem>
                    <MenuItem value="user_nickname">닉네임</MenuItem>
                    <MenuItem value="user_email">이메일</MenuItem>
                    <MenuItem value="user_tel">전화번호</MenuItem>
                    <MenuItem value="created_at">가입일자</MenuItem>
                    <MenuItem value="payment_date">구독일자</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="검색"
                  variant="outlined"
                  size="small"
                  value={searchMember}
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
            
            <Header />

            {/* 멤버 리스트 */}
            <Grid container spacing={3}>
              {sliceMembers.map((member) => (
                <Grid item xs={12} key={member.user_num} style={{ cursor: 'pointer', marginBottom: '5px' }} onClick={() => handleClickDetail(member.user_num)}>
                  <BlankCard>
                    <Grid container spacing={3} style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{member.user_num}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{member.user_name}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{member.user_nickname}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{member.user_tel}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{member.created_at}</Typography>                  
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant='h6' align='center'>{member.payment_date}</Typography>
                      </Grid>
                    </Grid>
                  </BlankCard>
                </Grid>
              ))}
            </Grid>
            
            {/* 페이지 네비게이션 */}
            <Pagination
              count={Math.ceil(filteredMembers.length / member10List)}
              page={pageTen}
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

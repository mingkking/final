import React, { useContext, useState } from 'react';
import { Typography, Grid, Pagination, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import BlankCard from '../../../components/shared/BlankCard';
import MemberListTest from './components/MemberList';
import mainContext from "../main/contexts/MainContext";

const MemberList = () => {
  const value = useContext(mainContext);
  const member10List = 10; // 페이지당 멤버 수
  const [pageTen, setPageTen] = useState(1); // 현재 페이지
  const [searchMember, setSearchMember] = useState(''); // 검색어
  const [filterField, setFilterField] = useState('user_name'); // 필터 기준
  const [filteredMembers, setFilteredMembers] = useState(value.state.memberList); // 필터링된 멤버 목록
  const navigate = useNavigate(); // Detail 페이지 이동

  // Detail 페이지로 이동
  const handleClickDetail = (user_num) => {
    console.log("클릭한 번호--------", user_num);
    navigate(`/manager/memberDetail/${user_num}`);    
  }

  // 페이지 변경 함수
  const handlePageChange = (event, page) => {
    setPageTen(page);
  };

  // 검색어 변경 함수
  const handleSearchChange = (event) => {
    setSearchMember(event.target.value);
  };

  // 검색 버튼 클릭 함수
  const handleSearchBtn = () => {
    const updateFilterMember = value.state.memberList.filter((member) => 
      member[filterField].toLowerCase().includes(searchMember.toLowerCase())
    );
    setFilteredMembers(updateFilterMember); // 멤버 목록에 검색한 데이터 넣기
    setPageTen(1); // 검색하면 페이지가 1로 되도록 설정
  };

  // 검색 드롭다운 변경 함수
  const handleFilterFieldChange = (event) => {
    setFilterField(event.target.value);
    setSearchMember(''); // 드롭다운이 변경될 때 검색어 초기화
    setFilteredMembers(value.state.memberList); // 전체 리스트로 초기화
    setPageTen(1); // 페이지가 1로 되도록 설정
  };

  // 현재 페이지에 표시할 멤버의 마지막 인덱스를 계산
  const indexLastMember = pageTen * member10List;
  // 현재 페이지에 표시할 멤버의 첫 번째 인덱스를 계산
  const indexFirstMember = indexLastMember - member10List;
  // 현재 페이지에 해당하는 멤버들을 잘라내기
  const sliceMembers = filteredMembers.slice(indexFirstMember, indexLastMember);

  return (
    <PageContainer title="Typography" description="this is Typography">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard>
            <Typography variant='h2' style={{ marginBottom: '40px', color: '#000000' }}>-- 회원목록 --</Typography>
            {/* 필터링 및 검색 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <FormControl variant="outlined" style={{ marginRight: '10px', minWidth: '120px' }}>
                <InputLabel>필터</InputLabel>
                <Select
                  value={filterField}
                  onChange={handleFilterFieldChange}
                  label="필터"
                  size='small'
                >
                  <MenuItem value="user_name">이름</MenuItem>
                  <MenuItem value="user_nickname">닉네임</MenuItem>
                  <MenuItem value="user_email">이메일</MenuItem>
                  <MenuItem value="user_tel">전화번호</MenuItem>
                  <MenuItem value="created_at">가입일자</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="검색"
                variant="outlined"
                size='small'
                value={searchMember}
                onChange={handleSearchChange}
                style={{ marginRight: '10px', minWidth: '200px' }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                style={{ height: '35px', padding: '6px 16px' }}
                onClick={handleSearchBtn}
              >
                검색
              </Button>
            </div>
            {/* 멤버 리스트 헤더 */}
            <div style={{ display: 'flex' }} >
              <Typography variant="h4" style={{ marginBottom: '20px', marginLeft: '30px' }}>번호</Typography>
              <Typography variant="h4" style={{ marginBottom: '20px', marginLeft: '70px' }}>이름</Typography>
              <Typography variant="h4" style={{ marginBottom: '20px', marginLeft: '100px' }}>닉네임</Typography>
              <Typography variant="h4" style={{ marginBottom: '20px', marginLeft: '100px' }}>전화번호</Typography>
              <Typography variant="h4" style={{ marginBottom: '20px', marginLeft: '120px' }}>이메일</Typography>
              <Typography variant="h4" style={{ marginBottom: '20px', marginLeft: '100px' }}>가입일자</Typography>
              <Typography variant="h4" style={{ marginBottom: '20px', marginLeft: '70px' }}>구독일시</Typography>
            </div> 
            {/* 멤버 리스트 */}
            <Grid container spacing={3}>
              <Grid item sm={12}>
                {sliceMembers.map((member) => (
                  <div key={member.user_num} style={{ cursor: 'pointer', marginBottom: '20px' }} onClick={() => handleClickDetail(member.user_num)}>
                  <BlankCard >
                    <MemberListTest 
                      num={member.user_num}
                      name={member.user_name}
                      nickname={member.user_nickname}
                      tel={member.user_tel}
                      email={member.user_email}
                      created_at={member.created_at}
                    />
                  </BlankCard>
                  </div>
                ))}
              </Grid>
            </Grid>
            {/* 페이지 네비게이션 */}
            <Pagination
              count={Math.ceil(filteredMembers.length / member10List)} // 총 페이지 수 계산
              page={pageTen} // 현재 페이지 설정
              onChange={handlePageChange} // 페이지 변경 함수
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

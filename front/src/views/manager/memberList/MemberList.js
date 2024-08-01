import React, { useContext, useState, useEffect } from 'react';
import { Typography, Grid, Pagination, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import BlankCard from '../../../components/shared/BlankCard';
import mainContext from "../main/contexts/MainContext";
import axios from 'axios';

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

  useEffect(() => {
    axios.get('http://localhost:8080/manager/memberList')
      .then((result) => {
        // manager/memberList 새로고침 할 때 마다 DB에서 값 받아서 데이터 넣기
        value.actions.setMemberList(result.data.selectMemberList);
      });
  }, []);

  return (
    <PageContainer title="회원 목록" description="회원 목록을 확인합니다.">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <DashboardCard>
            <Typography variant='h2' color='primary' style={{ textAlign: 'center', marginTop: '30px', marginBottom: '60px' }}>회원 목록</Typography>
            
            {/* 필터링 및 검색 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
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
            <Grid container spacing={3} style={{ marginBottom: '20px' }}>
              <Grid item xs={2}>
                <Typography variant='h5' align='center'>회원번호</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='h5' align='center'>이름</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='h5' align='center'>닉네임</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='h5' align='center'>전화번호</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='h5' align='center'>가입일자</Typography>                  
              </Grid>
              <Grid item xs={2}>
                <Typography variant='h5' align='center'>구독일자</Typography>
              </Grid>
            </Grid>

            {/* 분류선 */}
            <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} /> 


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
                        <Typography variant='h6' align='center'>2024-07-21</Typography>
                      </Grid>
                    </Grid>
                  </BlankCard>
                </Grid>
              ))}
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

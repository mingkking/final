import React, { useState, useEffect, useContext } from 'react';
import { Typography, Grid, Pagination, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import BlankCard from '../../../components/shared/BlankCard';
import axios from 'axios';
import Header from './components/ChatHeader'

const Chat = () => {
  const [chatList, setChatList] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [page, setPage] = useState(1);
  const [roomMemberCount, setRoomMemberCount] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('chat_num');
  const [sortField, setSortField] = useState('chat_num');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const chatsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:8080/manager/chat')
      .then((result) => {
        const chatListWithIndex = result.data.chatRoomList.map((chat, index) => ({
          ...chat,
          originalIndex: index,  // 원본 인덱스를 추가
        }));
        setChatList(chatListWithIndex);
        setFilteredChats(chatListWithIndex);
        setRoomMemberCount(result.data.memberCount);
      });
  }, []);

  const handleClickDetail = () => {
    navigate('/Chatting');
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchBtn = () => {
    filterAndSortChats();
  };

  const handleSearchFieldChange = (event) => {
    setSearchField(event.target.value);
    setSearchTerm('');
    filterAndSortChats();
  };

  const filterAndSortChats = () => {
    // 필터링
    const filtered = chatList.filter((chat) => {
      const matchesSearch = String(chat[searchField]).toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    // 정렬
    const sorted = filtered.sort((a, b) => {
      if (sortField === 'chat_num') {
        return sortOrder === 'asc' 
          ? parseInt(a[sortField]) - parseInt(b[sortField])
          : parseInt(b[sortField]) - parseInt(a[sortField]);
      } else if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a[sortField]) - new Date(b[sortField])
          : new Date(b[sortField]) - new Date(a[sortField]);
      } else {
        return sortOrder === 'asc'
          ? a[sortField].localeCompare(b[sortField])
          : b[sortField].localeCompare(a[sortField]);
      }
    });

    setFilteredChats(sorted);
    setPage(1);
  };


  useEffect(() => {
    filterAndSortChats();
  }, [searchField, searchTerm, sortField, sortOrder]);

  const indexOfLastChat = page * chatsPerPage;
  const indexOfFirstChat = indexOfLastChat - chatsPerPage;
  const currentChats = filteredChats.slice(indexOfFirstChat, indexOfLastChat);

  return (
    <PageContainer title="채팅 관리" description="채팅 관리">
      <DashboardCard>
        <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>채팅방 목록</Typography>
        
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
                <MenuItem value="id">채팅방 번호</MenuItem>
                <MenuItem value="room">채팅방 이름</MenuItem>
                <MenuItem value="createdAt">생성 일시</MenuItem>
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
                <MenuItem value="id">채팅방 번호</MenuItem>
                <MenuItem value="room">채팅방 이름</MenuItem>
                <MenuItem value="createdAt">생성 일시</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="검색"
              variant="outlined"
              size="small"
              value={searchTerm}
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

        {/* 채팅 리스트 */}
        <Grid container spacing={3}>
          {currentChats.map((chat) => (
            <Grid item xs={12} key={chat.originalIndex} style={{ cursor: 'pointer', marginBottom: '5px' }} onClick={() => handleClickDetail()}>
              <BlankCard>
                <Grid container spacing={3} style={{ paddingTop: '30px', paddingBottom: '30px' }}>
                  <Grid item xs={3}>
                    <Typography variant='h6' align='center'>{chat.originalIndex}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant='h6' align='center'>{chat.room}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant='h6' align='center'>{chat.createdAt}</Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant='h6' align='center'>{roomMemberCount[chat.originalIndex]}</Typography>
                  </Grid>
                </Grid>
              </BlankCard>
            </Grid>
          ))}
        </Grid>

        {/* 페이지 네비게이션 */}
        <Pagination
          count={Math.ceil(filteredChats.length / chatsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default Chat;
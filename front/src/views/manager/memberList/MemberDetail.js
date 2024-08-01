import React, { useEffect, useState } from 'react';
import { Typography, Grid, Button } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const MemberDetail = () => {
  const { user_num } = useParams();
  const [memberDetail, setMemberDetail] = useState(null); // 초기 상태를 null로 설정
  const [commPost, setCommPost] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태를 추가
  const navigate = useNavigate();

  useEffect(() => {
    const getMemberDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        console.log("디테일페이지 리스폰값", response)
        setMemberDetail(response.data.selectMemberList[0]);
        setCommPost(response.data.commPost);
      } catch (error) {
        console.error('회원 상세 정보 가져오기 실패:', error);
      } finally {
        setLoading(false); // 데이터 로딩 완료
      }
    };
    getMemberDetail();
  }, [user_num]); // useEffect


  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/manager/memberDetail/${user_num}`);
      alert('회원이 성공적으로 삭제되었습니다.');
      navigate('/manager/memberList', { replace: true });
      // 페이지 이동 후 새로고침(DB 가져오기)
      setTimeout(() => {
        window.location.reload();
      },100);
    } catch (error) {
      console.error('회원 삭제 실패:', error);
      alert('회원 삭제에 실패했습니다.');
    } finally {
      setLoading(false); // 데이터 로딩 완료
    }
  };

  if (loading) {
    return (
      <PageContainer title="회원 상세" description="회원의 상세 정보를 확인합니다.">
        <Typography variant="h4" align="center">처리중입니다...</Typography>
      </PageContainer>
    );
  }

// 생년월일 8글자로 바꾸기
const formatBirthDate = (birthDate) => {

  const yearPrefix = parseInt(birthDate.substring(0, 2), 10);
  const month = parseInt(birthDate.substring(2, 4), 10);
  const day = parseInt(birthDate.substring(4, 6), 10);

  // 2000년 이후라면 20세기, 그 전이면 21세기
  const year = yearPrefix >= 0 && yearPrefix <= 99 ? (yearPrefix >= 0 && yearPrefix <= 22 ? 2000 + yearPrefix : 1900 + yearPrefix) : null;
  return `${year}년 ${month}월 ${day}일`;
};

const eightBirthdate = formatBirthDate(memberDetail.user_birthdate);


  return (
    <PageContainer title="회원 상세" description="회원의 상세 정보를 확인합니다.">
      <Grid container spacing={3}>
        <Grid item sm={6}>
          <div align='left' style={{ marginTop: '100px' }}>
            <Typography variant="h4" color="primary" style={{ textAlign: 'left', marginBottom: '20px' }}>회원 상세 보기</Typography>
              <Grid container spacing={2}>
                <Grid item sm={6} style={{ textAlign: 'left'}}>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>회원번호</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>이름</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>닉네임</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>아이디</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>전화번호</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>이메일</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>생일</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>가입일시</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>구독일시</Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_num}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_name}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_nickname}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_id}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_tel}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_email}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{eightBirthdate}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.created_at}</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>
                  {memberDetail.subscribe_date ? memberDetail.subscribe_date : '구독 X'}
                  </Typography>
                </Grid>
              </Grid>
          </div>
          <Button onClick={handleDelete}>회원수정</Button>
          <Button onClick={handleDelete}>회원삭제</Button>
        </Grid>
        <Grid item sm={6}>
          <Grid container spacing={3}>
            <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
              <Typography variant='h4' align='left' color="primary" style={{ marginBottom: '20px' }}>관심 목록</Typography>
              <DashboardCard>
                <Grid container spacing={2}>
                  <Grid item sm={12}>
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <Typography variant='h5' style={{ marginBottom: '20px' }}>분류</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography variant='h5' style={{ marginBottom: '20px' }}>항목</Typography>
                      </Grid>
                    </Grid>
                    <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
                    <Grid container spacing={2}>
                      <Grid item sm={6}>
                        <Typography>주식</Typography>
                      </Grid>
                      <Grid item sm={6}>
                        <Typography>삼성전자</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DashboardCard>
            </Grid>
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
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MemberDetail;

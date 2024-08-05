import React, { useEffect, useState } from 'react';
import { Typography, Grid, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';


const MemberDetail = () => {
  const { user_num } = useParams();
  const [memberDetail, setMemberDetail] = useState(null);
  const [commPost, setCommPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [formData, setFormData] = useState({}); // 수정 가능한 필드의 값 저장
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const navigate = useNavigate();


  // 상세 정보 가져오기
  useEffect(() => {
    const getMemberDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        setMemberDetail(response.data.selectMemberList[0]);
        setCommPost(response.data.commPost);
        setFormData(response.data.selectMemberList[0]); // 기본값 설정
        setIsAdmin(response.data.checkMgr === 1);
        console.log("매니저값이 false인가----", isAdmin)
      } catch (error) {
        console.error('회원 상세 정보 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    getMemberDetail();
  }, [user_num]);

  // 삭제 함수
  const handleDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/manager/memberDetail/${user_num}`);
      alert('회원이 성공적으로 삭제되었습니다.');
      navigate('/manager/memberList', { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('회원 삭제 실패:', error);
      alert('회원 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  //  수정
  const handleUpdate = () => {
    setIsEditing(true); // 수정 모드로 전환
  };

  const handleCancel = () => {
    setIsEditing(false); // 수정 모드 취소
    setFormData(memberDetail); // 수정 전의 값으로 복원
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'is_admin') {
      setIsAdmin(e.target.checked);
    }
  };

  const handleSave = async () => {
    try {
      const dataToSend = {
        user_name: formData.user_name,
        user_nickname: formData.user_nickname,
        user_id: formData.user_id,
        user_tel: formData.user_tel,
        user_email: formData.user_email,
        is_admin: isAdmin ? 1 : 0 // 관리자 여부 추가
      };

    // 회원 수정 값 springboot로 보내기
    const response = await axios.put(`http://localhost:8080/manager/memberDetail/${user_num}`, dataToSend);

    console.log("데이타투샌드값 -----------", dataToSend)

    if (response.data === 1) {
      alert('회원 정보가 성공적으로 수정되었습니다.');
      setMemberDetail({...memberDetail, ...dataToSend});
      setIsEditing(false);
    } else {
      throw new Error(response.data.message || '수정에 실패했습니다.');
    }
  } catch (error) {
    console.error('회원 정보 수정 실패:', error);
    alert('회원 정보 수정에 실패했습니다: ' + error.message);
  }
  };

  if (loading) {
    return (
      <PageContainer title="회원 상세" description="회원의 상세 정보를 확인합니다.">
        <Typography variant="h4" align="center">처리중입니다...</Typography>
      </PageContainer>
    );
  }

  // 생년월일 설정
  const formatBirthDate = (birthDate) => {
    // 구글 로그인 하면 생년월일값이 입력이 안되는 부분 처리
    if (!birthDate) {
      return "구글 회원(생년월일 X)";
    }

    const yearPrefix = parseInt(birthDate.substring(0, 2), 10);
    const month = parseInt(birthDate.substring(2, 4), 10);
    const day = parseInt(birthDate.substring(4, 6), 10);
    const year = yearPrefix >= 0 && yearPrefix <= 99 ? (yearPrefix >= 0 && yearPrefix <= 24 ? 2000 + yearPrefix : 1900 + yearPrefix) : null;
    return `${year}년 ${month}월 ${day}일`;
  };

  const eightBirthdate = formatBirthDate(formData.user_birthdate || '');

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
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>생년월일</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>가입일시</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>구독일시</Typography>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>관리자여부</Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_num}</Typography>
                  {isEditing ? (
                    <>
                      <TextField name="user_name" value={formData.user_name} onChange={handleChange} size='small' style={{ marginBottom: '9px' }} />
                      <TextField name="user_nickname" value={formData.user_nickname} onChange={handleChange} size='small' style={{ marginBottom: '9px' }} />
                      <TextField name="user_id" value={formData.user_id} onChange={handleChange} size='small' style={{ marginBottom: '9px' }} />
                      <TextField name="user_tel" value={formData.user_tel} onChange={handleChange} size='small' style={{ marginBottom: '9px' }} />
                      <TextField name="user_email" value={formData.user_email} onChange={handleChange} size='small' style={{ marginBottom: '9px' }} />
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{eightBirthdate}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.created_at}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '10px' }}>바꿔야함</Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isAdmin}
                            onChange={handleChange}
                            name="is_admin"
                          />
                        }
                        label="관리자"
                      />
                    </>
                  ) : (
                    <>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_name}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_nickname}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_id}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_tel}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.user_email}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{eightBirthdate}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.created_at}</Typography>
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>바꿔야함</Typography>
                      {/* <Typography variant='h5' style={{ marginBottom: '20px' }}>{memberDetail.subscribe_date ? memberDetail.subscribe_date : '구독 X'}</Typography> */}
                      <Typography variant='h5' style={{ marginBottom: '20px' }}>
                        {isAdmin ? '관리자' : '일반 회원'}
                      </Typography>
                    </>
                  )}
                </Grid>
              </Grid>
          </div>
          {isEditing ? (
            <div style={{ marginTop: '30px' }}>
              <Button 
                onClick={handleSave}
                variant="contained"
                color="primary"
                size="small"
                style={{ height: '35px', padding: '6px 16px', margin: '5px' }}
              >
              저장
              </Button>
              <Button 
                onClick={handleCancel}
                variant="contained"
                color="primary"
                size="small"
                style={{ height: '35px', padding: '6px 16px', margin: '5px' }}
              >
              취소
              </Button>
            </div>
          ) : (
            <div style={{ marginTop: '30px' }}>
              <Button 
                onClick={handleUpdate}
                variant="contained"
                color="primary"
                size="small"
                style={{ height: '35px', padding: '6px 16px', margin: '5px' }}
              >
              회원수정
              </Button>
              <Button 
                onClick={handleDelete}
                variant="contained"
                color="primary"
                size="small"
                style={{ height: '35px', padding: '6px 16px', margin: '5px' }}
              >
              회원삭제
              </Button>
            </div>
          )}
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

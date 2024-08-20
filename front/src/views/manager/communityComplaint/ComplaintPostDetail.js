import React, { useEffect, useState } from 'react';
import { Typography, Grid, CircularProgress } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

const MemberDetail = () => {
  const { id } = useParams();
  const [complaintPostDetail, setComplaintPostDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // springboot에서 게시글 신고 상세 데이터 가져오기
  useEffect(() => {
    const getCommPostDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/complaint/commPostDetail/${id}`);
        console.log("신고게시글상세페이지: " , response);
        setComplaintPostDetail(response.data.complaintPostDetail[0]);
      } catch (error) {
        console.log("ComplaintDetail.js 16행 에러: ", error);
      } finally {
        setLoading(false);
      }
    };
    getCommPostDetail();
  }, [id]);

  // 데이터 가져오는 중 일 때
  if (loading) {
    return <CircularProgress />;
  };

  // 게시글 상세보기 버튼 클릭 함수
  const moveDetailCommPost = () => {
    navigate(`/DetailCommunity?id=${complaintPostDetail.type_num}`)
  }
  
  // 회원 삭제 함수
  const handleDeleteMember = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/manager/complaint/deleteMember/${complaintPostDetail.user_num}`);
      alert("회원이 성공적으로 삭제되었습니다.");
      navigate('/manager/complaint/communityPost', { replace: true });
    } catch (error) {
      console.log("회원 삭제 실패:", error);
      alert("회원 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 게시글 삭제 함수
  const handelDeletePost = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/manager/complaint/commPostDetail/deletePost/${complaintPostDetail.type_num}`);
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate('/manager/complaint/communityPost', { replace: true });
    } catch (error) {
        console.log("게시글 삭제 실패: ", error);
        alert("게시글 삭제에 실패했습니다.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer title="게시글 신고 상세" description="게시글 신고 상세">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item sm={6}>
          <div align='center' style={{ textAlign: 'center', marginTop: '100px' }} >
            <Typography variant="h4" color="primary" style={{ marginBottom: '70px' }}>
              게시글 신고 상세내용
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item sm={6} style={{ textAlign: 'left' }}>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>신고 번호</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>회원 번호</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>회원명</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>신고날짜</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>신고 사유</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>게시물 제목</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>게시물 내용</Typography>
              </Grid>
              <Grid item sm={6} style={{ textAlign: 'left' }}>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintPostDetail.id}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintPostDetail.user_num}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintPostDetail.user_name}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintPostDetail.created_at}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintPostDetail.content}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintPostDetail.title}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintPostDetail.contents}</Typography>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Grid style={{ marginTop: '50px'}}>
        <Button 
          onClick={handleDeleteMember}
          variant="contained"
          color="primary"
          size="small"
          style={{ height: '35px', padding: '6px 16px', marginRight: '20px' }}
        >
        회원 삭제
        </Button>
        <Button 
          onClick={handelDeletePost}
          variant="contained"
          color="primary"
          size="small"
          style={{ height: '35px', padding: '6px 16px', marginRight: '20px' }}
        >
        게시글 삭제
        </Button>
        <Button 
          onClick={moveDetailCommPost}
          variant="contained"
          color="primary"
          size="small"
          style={{ height: '35px', padding: '6px 16px' }}
        >
        게시글 상세보기
        </Button>
      </Grid>
    </PageContainer>
  );
};

export default MemberDetail;

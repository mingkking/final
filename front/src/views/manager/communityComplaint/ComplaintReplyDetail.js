import React, { useEffect, useState } from 'react';
import { Typography, Grid } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';

const MemberDetail = () => {
  const { id } = useParams();
  const [complaintReplyDetail, setComplaintReplyDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // springboot에서 게시글 신고 상세 데이터 가져오기
  useEffect(() => {
    const getCommPostDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/complaint/commReplyDetail/${id}`);
        console.log("신고댓글상세페이지: " , response);
        setComplaintReplyDetail(response.data.complaintReplyDetail[0]);
      } catch (error) {
        console.log("ComplaintReplyDetail.js 15행 에러: ", error);
      } finally {
        setLoading(false);
      }
    };
    getCommPostDetail();
  }, [id]);

  // 데이터 가져오는 중 일 때
  if (loading) {
    return (
      <PageContainer>
        <Typography variant="h4" align="center">처리중입니다...</Typography>
      </PageContainer>
    );
  };

  // 댓글 상세보기 버튼 클릭 함수
  const moveDetailCommPost = () => {
    navigate(`/DetailCommunity?id=${complaintReplyDetail.commNum}`)
  }
  
  // 회원 삭제 함수
  const handleDeleteMember = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/manager/complaint/deleteMember/${complaintReplyDetail.user_num}`);
      alert("회원이 성공적으로 삭제되었습니다.");
      navigate('/manager/complaint/communityReply', { replace: true });
    } catch (error) {
      console.log("회원 삭제 실패:", error);
      alert("회원 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 댓글 삭제 함수
  const handelDeleteReply = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/manager/complaint/commReplyDetail/deleteReply/${complaintReplyDetail.type_num}`);
      alert("댓글이 성공적으로 삭제되었습니다.");
      navigate('/manager/complaint/communityPost', { replace: true });
    } catch (error) {
        console.log("댓글 삭제 실패: ", error);
        alert("댓글 삭제에 실패했습니다.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer title="댓글 신고 상세" description="댓글 신고 상세">
      <Grid container spacing={3} justifyContent="center" alignItems="center">
        <Grid item sm={6}>
          <div align='center' style={{ textAlign: 'center', marginTop: '100px' }} >
            <Typography variant="h4" color="primary" style={{ marginBottom: '70px' }}>
              댓글 신고 상세내용
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item sm={6} style={{ textAlign: 'left' }}>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>신고 번호</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>회원 번호</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>회원명</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>신고날짜</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>신고 사유</Typography>
                <Typography variant="h5" style={{ marginBottom: '20px' }}>댓글 내용</Typography>
              </Grid>
              <Grid item sm={6} style={{ textAlign: 'left' }}>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintReplyDetail.id}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintReplyDetail.user_num}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintReplyDetail.user_name}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintReplyDetail.created_at}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintReplyDetail.content}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintReplyDetail.title}</Typography>
                <Typography variant='h5' style={{ marginBottom: '20px' }}>{complaintReplyDetail.contents}</Typography>
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
          onClick={handelDeleteReply}
          variant="contained"
          color="primary"
          size="small"
          style={{ height: '35px', padding: '6px 16px', marginRight: '20px' }}
        >
        댓글 삭제
        </Button>
        <Button 
          onClick={moveDetailCommPost}
          variant="contained"
          color="primary"
          size="small"
          style={{ height: '35px', padding: '6px 16px' }}
        >
        댓글 상세보기
        </Button>
      </Grid>
    </PageContainer>
  );
};

export default MemberDetail;

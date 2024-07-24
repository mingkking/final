// import React, { useContext, useEffect, useState } from 'react';
// import { Typography, Grid, Button } from '@mui/material';
// import PageContainer from '../../../components/container/PageContainer';
// import DashboardCard from '../../../components/shared/DashboardCard';
// import mainContext from "../main/contexts/MainContext";
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const MemberDetail = () => {
//   const { user_num } = useParams();
//   const [memberDetail, setMemberDetail] = useState(null);

//   useEffect(() => {
//     const getMemberDetail = async () => {
//         const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
//         console.log("회원 상세 정보:", response.data);
//         setMemberDetail(response.data[0]);
//         console.log("뭘까유-----", response.data[0]);
//         // 응답 데이터 처리
//     };
//     getMemberDetail();
//     console.log("멤버디테일", memberDetail);
//   }, []);

//   return (
//     <PageContainer title="회원 상세" description="회원의 상세 정보를 확인합니다.">
//       <Grid container spacing={3}>
//         <Grid item sm={6}>
//           {/* 멤버 리스트 헤더 */}
//           <div align='left' style={{ marginTop: '100px' }}>
//             <Typography variant="h3" style={{ textAlign: 'center', marginBottom: '50px' }}>회원 상세 보기</Typography>
//             <Typography variant="h4" style={{ marginBottom: '25px' }}>번호: {memberDetail.user_name}</Typography>
//             <Typography variant="h4" style={{ marginBottom: '25px' }}>이름</Typography>
//             <Typography variant="h4" style={{ marginBottom: '25px' }}>닉네임</Typography>
//             <Typography variant="h4" style={{ marginBottom: '25px' }}>전화번호</Typography>
//             <Typography variant="h4" style={{ marginBottom: '25px' }}>이메일</Typography>
//             <Typography variant="h4" style={{ marginBottom: '25px' }}>가입일자</Typography>
//             <Typography variant="h4" style={{ marginBottom: '25px' }}>구독일시</Typography>
//           </div>
//           <Button>회원삭제</Button>
//         </Grid>
//         <Grid item sm={6}>
//           <Grid container spacing={3}>
//             <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
//               <Typography variant='h4' align='left' style={{ marginBottom: '20px' }}>관심 목록</Typography>
//               <DashboardCard>
//                 <Grid container spacing={2}>
//                   <Grid item sm={12}>
//                     <Grid container spacing={2}>
//                       <Grid item sm={6}>
//                         <Typography variant='h5' style={{ marginBottom: '20px' }}>분류</Typography>
//                       </Grid>
//                       <Grid item sm={6}>
//                         <Typography variant='h5' style={{ marginBottom: '20px' }}>항목</Typography>
//                       </Grid>
//                     </Grid>
//                     <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
//                     <Grid container spacing={2}>
//                       <Grid item sm={6}>
//                         <Typography>주식</Typography>
//                       </Grid>
//                       <Grid item sm={6}>
//                         <Typography>삼성전자</Typography>
//                       </Grid>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//               </DashboardCard>
//             </Grid>
//             <Grid item sm={12}>
//               <Typography variant='h4' align='left' style={{ marginBottom: '20px' }}>글 작성 목록</Typography>
//               <DashboardCard>
//                 <Grid container spacing={3}>
//                   <Grid item sm={4}>
//                     <Typography variant='h5' style={{ marginBottom: '20px' }}>글 제목</Typography>
//                   </Grid>
//                   <Grid item sm={4}>
//                     <Typography variant='h5' style={{ marginBottom: '20px' }}>글 내용</Typography>
//                   </Grid>
//                   <Grid item sm={4}>
//                     <Typography variant='h5' style={{ marginBottom: '20px' }}>작성 날짜</Typography>
//                   </Grid>
//                 </Grid>
//                 <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
//                 <Grid container spacing={3}>
//                   <Grid item sm={4}>
//                     <Typography>요즘 장이 너...</Typography>
//                   </Grid>
//                   <Grid item sm={4}>
//                     <Typography>오르락 내리...</Typography>
//                   </Grid>
//                   <Grid item sm={4}>
//                     <Typography>2024-07-22</Typography>
//                   </Grid>
//                 </Grid>
//               </DashboardCard>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </PageContainer>
//   );
// };

// export default MemberDetail;

import React, { useEffect, useState } from 'react';
import { Typography, Grid, Button } from '@mui/material';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MemberDetail = () => {
  const { user_num } = useParams();
  const [memberDetail, setMemberDetail] = useState(null); // 초기 상태를 null로 설정
  const [loading, setLoading] = useState(true); // 로딩 상태를 추가

  useEffect(() => {
    const getMemberDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        setMemberDetail(response.data[0]);
      } catch (error) {
        console.error('회원 상세 정보 가져오기 실패:', error);
      } finally {
        setLoading(false); // 데이터 로딩 완료
      }
    };
    getMemberDetail();
  }, [user_num]);

  if (loading) {
    return (
      <PageContainer title="회원 상세" description="회원의 상세 정보를 확인합니다.">
        <Typography variant="h4" align="center">회원 정보를 불러오는 중입니다...</Typography>
      </PageContainer>
    );
  }


  return (
    <PageContainer title="회원 상세" description="회원의 상세 정보를 확인합니다.">
      <Grid container spacing={3}>
        <Grid item sm={6}>
          <div align='left' style={{ marginTop: '100px' }}>
            <Typography variant="h3" style={{ textAlign: 'center', marginBottom: '50px' }}>회원 상세 보기</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px' }}>번호: {memberDetail.user_num}</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px' }}>이름: {memberDetail.user_name}</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px' }}>닉네임: {memberDetail.user_nickname}</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px' }}>전화번호: {memberDetail.user_tel}</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px' }}>이메일: {memberDetail.user_email}</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px' }}>가입일자: {memberDetail.created_at}</Typography>
            <Typography variant="h4" style={{ marginBottom: '25px' }}>구독일시: {memberDetail.created_at}</Typography>
          </div>
          <Button>회원삭제</Button>
        </Grid>
        <Grid item sm={6}>
          <Grid container spacing={3}>
            <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
              <Typography variant='h4' align='left' style={{ marginBottom: '20px' }}>관심 목록</Typography>
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
              <Typography variant='h4' align='left' style={{ marginBottom: '20px' }}>글 작성 목록</Typography>
              <DashboardCard>
                <Grid container spacing={3}>
                  <Grid item sm={4}>
                    <Typography variant='h5' style={{ marginBottom: '20px' }}>글 제목</Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant='h5' style={{ marginBottom: '20px' }}>글 내용</Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography variant='h5' style={{ marginBottom: '20px' }}>작성 날짜</Typography>
                  </Grid>
                </Grid>
                <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
                <Grid container spacing={3}>
                  <Grid item sm={4}>
                    <Typography>요즘 장이 너...</Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography>오르락 내리...</Typography>
                  </Grid>
                  <Grid item sm={4}>
                    <Typography>2024-07-22</Typography>
                  </Grid>
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

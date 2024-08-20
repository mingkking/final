// import React, { useEffect, useState } from 'react';
// import { Typography, Grid, Pagination } from '@mui/material';
// import DashboardCard from '../../../../components/shared/DashboardCard';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// const Interest = () => {
//   const { user_num } = useParams();
//   const [interestEstate, setInterestEstate] = useState([]);
//   const interestPerPage = 3;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [currentInterest, setCurrentInterest] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const getInterestEstate = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
//         setInterestEstate(response.data.interestEstate);
//       } catch (error) {
//         console.error("Interest.js 에러: ", error);
//       }
//     };

//     getInterestEstate();
//   }, [user_num]);

//   useEffect(() => {
//     const indexOfLastPost = currentPage * interestPerPage;
//     const indexOfFirstPost = indexOfLastPost - interestPerPage;
//     setCurrentInterest(interestEstate.slice(indexOfFirstPost, indexOfLastPost));
//   }, [currentInterest, interestEstate, interestPerPage]);

//   const paginate = (event, pageNumber) => setCurrentPage(pageNumber);

//   // 부동산 페이지로 이동
//   const handleClickEstate = () => {
//     navigate('/budongsan');
//   }

//   return (
//     <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
//       <Typography variant='h4' align='left' color="primary" style={{ marginBottom: '20px' }}>관심 목록</Typography>
//         <DashboardCard>
//           <Grid container spacing={2}>
//             <Grid item sm={6}>
//               <Typography variant="h5" sx={{ mb: 2 }}>분류</Typography>
//             </Grid>
//             <Grid item sm={6}>
//               <Typography variant="h5" sx={{ mb: 2 }}>항목</Typography>
//             </Grid>
//           </Grid>
//           <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
//           <Grid container spacing={2}>
//             {interestEstate.length === 0 ? (
//               <Grid item sm={12}>
//                 <Typography>관심 목록 없음</Typography>
//               </Grid>
//             ) : (
//               interestEstate.map((interest, index) => {

//               return(
//                 <React.Fragment key={index}>
//                   <Grid item sm={6}>
//                     <Typography>{interest.type}</Typography>
//                   </Grid>
//                   <Grid item sm={6}>
//                     <Typography>{interest.name}</Typography>
//                   </Grid>
//                 </React.Fragment>
//               )
//             })
//           )}
//         </Grid>
//         {/* 페이지네이션 */}
//         {interestEstate.length > 3 && (
//           <Pagination
//             count={Math.ceil(interestEstate.length / interestPerPage)}
//               page={currentPage}
//               onChange={paginate}
//               color="primary"
//               style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
//             />
//           )}
//       </DashboardCard>
//     </Grid>
//   );
// };

// export default Interest;


import React, { useEffect, useState } from 'react';
import { Typography, Grid, Pagination } from '@mui/material';
import DashboardCard from '../../../../components/shared/DashboardCard';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Interest = () => {
  const { user_num } = useParams();
  const [interestEstate, setInterestEstate] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentInterest, setCurrentInterest] = useState([]);
  const interestPerPage = 3;
  const navigate = useNavigate();

  // 데이터 받아오기
  useEffect(() => {
    const getInterestEstate = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/manager/memberDetail/${user_num}`);
        setInterestEstate(response.data.interestEstate);
      } catch (error) {
        console.error("Interest.js 에러: ", error);
      }
    };

    getInterestEstate();
  }, [user_num]);

  // 페이지네이션
  useEffect(() => {
    const indexOfLastPost = currentPage * interestPerPage;
    const indexOfFirstPost = indexOfLastPost - interestPerPage;
    setCurrentInterest(interestEstate.slice(indexOfFirstPost, indexOfLastPost));
  }, [currentPage, interestEstate]);

  const paginate = (event, pageNumber) => setCurrentPage(pageNumber);

  // 부동산 페이지로 이동
  const handleClickEstate = (type) => {
    if(type === '부동산'){
      navigate('/budongsan');
    } else {
      navigate('/stock')
    }
  }

  return (
    <Grid item sm={12} style={{ marginTop: '40px', marginBottom: '40px' }}>
      <Typography variant='h4' align='left' color="primary" style={{ marginBottom: '20px' }}>관심 목록</Typography>
      <DashboardCard>
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Typography variant="h5" sx={{ mb: 2 }}>분류</Typography>
          </Grid>
          <Grid item sm={6}>
            <Typography variant="h5" sx={{ mb: 2 }}>항목</Typography>
          </Grid>
        </Grid>
        <div style={{ borderBottom: '1px solid #c9c9c9', marginBottom: '20px' }} />
        <Grid container spacing={2}>
          {currentInterest.length === 0 ? (
            <Grid item sm={12}>
              <Typography>관심 목록 없음</Typography>
            </Grid>
          ) : (
            currentInterest.map((interest, index) => (
              <React.Fragment key={index}>
                <Grid container item sm={12} key={index} style={{ cursor: 'pointer' }} onClick={() => handleClickEstate(interest.type)}>
                  <Grid item sm={6}>
                    <Typography>{interest.type}</Typography>
                  </Grid>
                  <Grid item sm={6}>
                    <Typography>{interest.name}</Typography>
                  </Grid>
                </Grid>
              </React.Fragment>
            ))
          )}
        </Grid>
        {/* 페이지네이션 */}
        {interestEstate.length > interestPerPage && (
          <Pagination
            count={Math.ceil(interestEstate.length / interestPerPage)}
            page={currentPage}
            onChange={paginate}
            color="primary"
            style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          />
        )}
      </DashboardCard>
    </Grid>
  );
};

export default Interest;

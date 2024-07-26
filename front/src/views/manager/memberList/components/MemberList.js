import React, { useEffect, useContext } from 'react';
import { Typography, CardContent } from '@mui/material';
import axios from 'axios';
import mainContext from '../../main/contexts/MainContext';



const MemberListTest = ({num, name, nickname, tel, email, created_at}) => {

  const value = useContext(mainContext);

  useEffect(()=>{
    axios.get('http://192.168.56.1:8080')
    .then((result) => {
      // manager/main 새로고침 할 때 마다 DB에서 값 받아서 데이터 넣기
      value.actions.setMemberList(result.data.selectMemberList);
    })
  },[]); 

  return (
                  <CardContent style={{display: 'flex'}} >
                    <Typography variant="h6" color="textSecondary" style={{marginTop: '10px', marginLeft: '20px'}}>
                      {num}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{marginTop: '10px', marginLeft: '80px'}}>
                      {name}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{marginTop: '10px', marginLeft: '115px'}}>
                      {nickname}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{marginTop: '10px', marginLeft: '100px'}}>
                      {tel}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{marginTop: '10px', marginLeft: '70px'}}>
                      {email}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{marginTop: '10px', marginLeft: '50px'}}>
                      {created_at}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" style={{marginTop: '10px', marginLeft: '30px'}}>
                      2024/03/23
                    </Typography>
                  </CardContent>
  );
};

export default MemberListTest;

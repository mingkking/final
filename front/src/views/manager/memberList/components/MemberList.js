import React, { useEffect, useContext } from 'react';
import { Typography, CardContent } from '@mui/material';




const MemberListTest = ({num, name, nickname, tel, email, created_at}) => {


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

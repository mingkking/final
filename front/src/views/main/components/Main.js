import React, { useEffect, useContext } from 'react';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';

import mainContext from "../../manager/main/contexts/MainContext";

const MemberCount = () => {

  useEffect(()=>{
    axios.get('http://localhost:8080')
  },[]);
  // 이거 방문자 수 구하는 거라서 여기까지 삭제하지 말아주세용 - 혜경

  return (
    <>
    </>
  );
};

export default MemberCount;



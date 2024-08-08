// import React, { useEffect } from 'react';
// import { Typography } from '@mui/material';
// import BlankCard from '../../../components/shared/BlankCard';
// import { useNavigate } from 'react-router-dom';

// const NewsCard = ({ news }) => {

//   const navigate = useNavigate();

//   console.log("newsCard에서 받은 뉴스 값: ", news)


//   return (
//     <div>
//       <Typography variant="h6">zz</Typography>
//     </div>
//   );
// };

// export default NewsCard;

import React from 'react';
import { Typography, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ news }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ maxWidth: 345 }}>
      {/* 이미지 */}
      <CardMedia
        component="img"
        height="140"
        image={news.imgs}
        alt={news.title}
      />
      <CardContent>
        {/* 제목 */}
        <Typography variant="h6" component="div">
          {news.title}
        </Typography>
        {/* 내용 */}
        <Typography variant="body2" color="text.secondary">
          {news.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NewsCard;

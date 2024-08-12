import React from 'react';
import { Typography } from '@mui/material';
import BlankCard from '../../../components/shared/BlankCard';
import nullImg from '../../../imges/nullimg.png';

const NewsCard = ({ news }) => {
  
  // 클릭 시 뉴스 상세 페이지로 이동하는 함수
  const handleClickPost = () => {
    window.location.href = news.url;
  };

  const sliceText = (text) => {
    return text.length > 30 ? text.slice(0, 31) + "..." : text;
  };


  return (
    <BlankCard>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onClick={handleClickPost}>
        {/* 이미지 컨테이너 */}
        <div style={{ 
          width: '100%', 
          paddingTop: '75%', // 4:3 비율
          position: 'relative', 
          overflow: 'hidden', 
          cursor: 'pointer' 
        }}>
          <img 
            src={news.imgs ? news.imgs : nullImg}
            alt='뉴스 이미지'
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
        {/* 제목과 날짜 */}
        <div style={{ padding: '10px', textAlign: 'center' }}>
          <Typography variant='h6'>{sliceText(news.title)} </Typography>
          <Typography variant='caption' color='textSecondary' style={{ marginTop: '10px' }}>
            {news.published_at}
          </Typography>
        </div>
        <div style={{ display: 'none' }}>{news.url}</div>
      </div>
    </BlankCard>
  );
};

export default NewsCard;

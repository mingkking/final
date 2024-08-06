import React from 'react';
import { Typography } from '@mui/material';
import BlankCard from '../../../../components/shared/BlankCard';
import nullImg from '../../../../imges/sample.png';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  
  const handleClickPost = () => {
    navigate(`/DetailCommunity?id=${post.id}`);
  };

  const sliceText = (text) => {
    return text.length > 7 ? text.slice(0, 9) + "..." : text;
  };

  return (
    <BlankCard>
      <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', cursor: 'pointer' }} onClick={handleClickPost}>
        <img 
          src={post.image_path || nullImg} 
          alt={post.id} 
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
      <div style={{ padding: '10px' }}>
        <Typography variant='subtitle1'>제목: {sliceText(post.title)}</Typography>
        <Typography variant='caption' color='textSecondary'>작성자: {post.user_name}</Typography>
      </div>
      {/* 보이지는 않지만 검색은 가능하도록 */}
      <div style={{ display: 'none' }}>{post.created_at}</div>
      <div style={{ display: 'none' }}>{post.contents}</div>
      <div style={{ display: 'none' }}>{post.user_num}</div>
    </BlankCard>
  );
};

export default PostCard;
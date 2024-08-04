import React from 'react';
import { Typography } from '@mui/material';
// import BlankCard from '../../../components/shared/BlankCard';
import BlankCard from '../../../../components/shared/BlankCard';
import nullImg from '../../../../imges/sample.png';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {

  const navigate = useNavigate();
  
  // 클릭하면 커뮤니티 글 상세 페이지로 이동
  const handleClickPost = () => {
    navigate(`/DetailCommunity?id=${post.id}`);
  }

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
        <Typography variant='subtitle1'>{post.title}</Typography>
        <Typography variant='caption' color='textSecondary'>{post.created_at}</Typography>
      </div>
    </BlankCard>
  );
};

export default PostCard;
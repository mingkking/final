import React from 'react';
import { Grid } from '@mui/material';
import PostCard from './PostCard';

const PostGrid = ({ posts }) => {
  return (
    <Grid container spacing={3}>
      {posts.map((post, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
};

export default PostGrid;
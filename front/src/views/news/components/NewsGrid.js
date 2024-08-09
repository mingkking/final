import React from 'react';
import { Grid } from '@mui/material';
import NewsCard from './NewsMainCard';
import FinanceNewsCard from './FinanceNews';
import RealEstateNewsCard from './RealEstateNews';
import EconomyNewsCard from './EconomyNews';

const NewsGrid = ({ news, category }) => {

  const getNewsCard = (newsItem, index) => {
    switch (category) {
      case 'finance':
        return <FinanceNewsCard news={newsItem} key={index} />;
      case 'realEstate':
        return <RealEstateNewsCard news={newsItem} key={index} />;
      case 'economy':
        return <EconomyNewsCard news={newsItem} key={index} />;
      default:
        return <NewsCard news={newsItem} key={index} />;
    }
  };

  return (
    <div style={{ margin: '40px auto', maxWidth: '1200px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3}>
            {news.slice(0, Math.ceil(news.length / 2)).map((newsItem, index) => (
              <Grid item xs={12} key={index}>
                {getNewsCard(newsItem, index)}
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={3}>
            {news.slice(Math.ceil(news.length / 2)).map((newsItem, index) => (
              <Grid item xs={12} key={index + Math.ceil(news.length / 2)}>
                {getNewsCard(newsItem, index + Math.ceil(news.length / 2))}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default NewsGrid;

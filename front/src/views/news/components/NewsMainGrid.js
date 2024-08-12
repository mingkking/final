import React from 'react';
import { Grid } from '@mui/material';
import NewsMainCard from './NewsMainCard';

const NewsMainGrid = ({ news }) => {
  // 뉴스 데이터를 3개의 섹션으로 분리합니다.
  const news10 = news; // 첫 번째 섹션에 표시될 뉴스 카드
  const firstNews = news10[0];
  const section1 = news10.slice(1, 10);

  return (
    <div style={{ margin: '40px auto', maxWidth: '1200px' }}>
      <Grid container spacing={3} justifyContent="center">
        {/* 큰 뉴스 카드 */}
        {section1.length > 0 && (
          <Grid item xs={12} sm={8} md={8} lg={6}>
            <NewsMainCard news={firstNews} />
          </Grid>
        )}

        <Grid item xs={12} sm={8} md={8} lg={8}>
          <Grid container spacing={3}>
            {section1.map((newsItem, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <NewsMainCard news={newsItem} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default NewsMainGrid;

// import React from 'react';
// import { Grid } from '@mui/material';
// import NewsCard from './NewsCard';


// function NewsMainGrid({ news }) {

//   console.log("newsMainGrid에서 받은 news값: ", news);
//   console.log("newsMainGrid에서 받은 news값: ", news[0]);


//     return (
//         <Grid container spacing={3}>
//           <Grid item xs={12} sm={6} md={3}>
//             <NewsCard news={news} />
//           </Grid>
//       </Grid>
//     ); 
// } 

// export default NewsMainGrid;

import React from 'react';
import { Grid } from '@mui/material';
import NewsCard from './NewsCard';

function NewsMainGrid({ news }) {

  console.log("newsMainGrid뉴스값: ", news)

    // 뉴스 데이터를 4개의 섹션으로 분리합니다.
    const [largePost, ...remainingPosts] = news;
    const section1 = remainingPosts.slice(0, 2);  // 첫 번째 섹션에 표시될 두 개의 뉴스 카드
    const section2 = remainingPosts.slice(2, 4);  // 두 번째 섹션에 표시될 두 개의 뉴스 카드
    const section3 = remainingPosts.slice(4, 6);  // 세 번째 섹션에 표시될 두 개의 뉴스 카드
    console.log("섹션값: ", section1)

    return (
        <Grid container spacing={3} justifyContent="center">
            {/* 큰 뉴스 카드 */}
            <Grid item xs={12} md={6} lg={4}>
                <NewsCard news={largePost} />
            </Grid>

            {/* 나머지 뉴스 카드들 */}
            <Grid item xs={12} md={6} lg={4}>
                <Grid container spacing={3}>
                    {section1.map((news, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <NewsCard news={news} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <Grid container spacing={3}>
                    {section2.map((news, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <NewsCard news={news} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
                <Grid container spacing={3}>
                    {section3.map((news, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <NewsCard news={news} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default NewsMainGrid;

import React from 'react';
import { Typography } from '@mui/material';
import BlankCard from '../../../components/shared/BlankCard';
import nullImg from '../../../imges/nullimg.png';

function EconomyNews({ news }) {

    const handleClickPost = () => {
        window.location.href = news.url;
    };

    const sliceText = (text) => {
        return text.length > 30 ? text.slice(0, 31) + "..." : text;
    };

    return (
        <BlankCard>
            <div 
                style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    cursor: 'pointer',
                    backgroundColor:'#282E3C',
                }} 
                onClick={handleClickPost}
            >
                {/* 이미지 컨테이너 */}
                <div style={{ 
                    width: '120px', 
                    height: '90px', 
                    marginRight: '10px', 
                    position: 'relative', 
                    overflow: 'hidden'
                }}>
                    <img 
                        src={news.imgs ? news.imgs : nullImg}
                        alt='뉴스 이미지'
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>
                {/* 제목과 날짜 */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginTop: '25px',
                    color:'#fff',
                }}>
                    <Typography variant='h6'>{sliceText(news.title)}</Typography>
                    <Typography variant='caption' color='#fff' style={{ marginTop: '5px', textAlign: 'left'}}>
                        {news.published_at}
                    </Typography>
                </div>
            </div>
        </BlankCard>
    );
}

export default EconomyNews;

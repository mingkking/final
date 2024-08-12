import React from 'react';

const DividendInvesting = () => {
    const videos = [
        {
            title: '99% 실수하는 배당투자',
            description: '월배당, 월배당주, 배당주식,  stock, s&p500, investing, nasdaq, asset, us stock, dividend, dividend king, 미국주식, 성환김',
            imageUrl: 'https://i.ytimg.com/vi/oGmD-up_Pj4/maxresdefault.jpg',
            videoUrl: 'https://youtu.be/oGmD-up_Pj4?si=FnMbWIOgCjdCn2m0&utm_source=therich&utm_medium=therich'
        },
        {
            title: '진짜 노후준비는 이렇게 해야합니다',
            description: '본 영상에서 제공하는 투자관련 내용은 철저하게 개인의견이며, 특정 업종/종목에 대한 추천, 매수, 매도 의견이 절대 아닙니다. ',
            imageUrl: 'https://i.ytimg.com/vi/jH5oN2M-wpE/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=jH5oN2M-wpE&utm_source=therich&utm_medium=therich'
        },
        {
            title: 'BITO ETF, 비트코인 ETF 의 배당금은 얼마일까요 ?',
            description: '본 영상에서 제공하는 투자관련 내용은 철저하게 개인의견이며, 특정 업종/종목에 대한 추천, 매수, 매도 의견이 절대 아닙니다. ',
            imageUrl: 'https://i.ytimg.com/vi/embhyYxbp-M/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=embhyYxbp-M&utm_source=therich&utm_medium=therich'
        },
        {
            title: 'QQQY ETF 배당왕이 될수 있을까요? feat. TSLY 2편',
            description: '본 영상에서 제공하는 투자관련 내용은 철저하게 개인의견이며, 특정 업종/종목에 대한 추천, 매수, 매도 의견이 절대 아닙니다. ',
            imageUrl: 'https://i.ytimg.com/vi/vAeUjWKxqCs/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=vAeUjWKxqCs&utm_source=therich&utm_medium=therich'
        },
    ];

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {videos.map((video, index) => (
                <div key={index} style={{ flex: '1 1 calc(25% - 20px)', marginBottom: '20px' }}> {/* 4개를 한 줄에 배치 */}
                    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                        <img
                            src={video.imageUrl}
                            alt={video.title}
                            style={{ width: '100%', maxWidth: '300px', height: 'auto' }} // 이미지 사이즈 조정
                        />
                    </a>
                    <div style={{ textAlign: 'left', maxWidth: '300px', margin: '10px 0' }}> {/* 왼쪽 정렬 */}
                        <h3
                            style={{
                                fontSize: '1rem',
                                margin: '10px 0',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {video.title}
                        </h3>
                        <p
                            style={{
                                fontSize: '0.875rem',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {video.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DividendInvesting;

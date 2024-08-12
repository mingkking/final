import React from 'react';

const BudongsanSite = () => {
    const videos = [
        {
            title: '[레전드모음] 2023 부동산 전망 한방에 정리해드립니다｜이스트스프링자산운용코리아 배문성 크레딧 애널리스트',
            description: '🖋중국 전문가 이철 박사의 강의가 마침내 출시되었습니다. 언더스탠딩 특강 1탄, 이철 박사가 총 10개의 강의로 전하는 중국 공산당의 100년 계획과 대만 통일 시나리오까지. “달라진 중국 달라질 중국” 시진핑 연임으로 시작되는 중국의 변화를 가장 자세한 설명으로 만나보시죠.',
            imageUrl: 'https://i.ytimg.com/vi/4JwZ0IHTG4k/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=4JwZ0IHTG4k&utm_source=therich&utm_medium=therich'
        },
        {
            title: '무주택자는 집 사지 마세요, "그 이유를" 말씀드리죠 (김광석 실장)',
            description: '무주택자는 집 사지 마세요, "그 이유를" 말씀드리죠',
            imageUrl: 'https://i.ytimg.com/vi/FTG6OeWb7mM/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=FTG6OeWb7mM&utm_source=therich&utm_medium=therich'
        },
        {
            title: '왜 아파트를 안사고 월세 290만원이나 내면서 사는걸까?',
            description: '최근까지 광교에 위치한 본인의 집 더샵 3룸 오피스텔(아파텔)에 거주하다 집이 좁아 같은 단지 3룸 아파트로 이사를 가신 유튜버 경장인님 부부의 이야기 입니다.',
            imageUrl: 'https://i.ytimg.com/vi/xvHHDW-ibzc/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=xvHHDW-ibzc&utm_source=therich&utm_medium=therich'
        },
        {
            title: '집값, 대세 하락장에 접어든 이유를 설명해 드립니다 [한문도 교수 1부 @tv_4355',
            description: '돈 되는 아파트 매수 방법,  이 강의에 모두 담았습니다',
            imageUrl: 'https://i.ytimg.com/vi/VJnIIbUblB0/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=VJnIIbUblB0&utm_source=therich&utm_medium=therich'
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

export default BudongsanSite;

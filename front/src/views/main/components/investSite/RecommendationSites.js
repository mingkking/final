import React from 'react';

const RecommendationSites = () => {
    const videos = [
        {
            title: '🎊국내 최초🎊 미국 공모주에 투자하는 정말 쉬운 방법 | 우리 정말 쉬운 미국공모주 펀드💸',
            description: '세계 최대 주식시장인 미국 공모주에 투자하여 안정적인 수익을 추구 하는 우리 정말 쉬운 미국공모주 펀드 지금 바로 만나보세요😊',
            imageUrl: 'https://i.ytimg.com/vi/QbMFQ58zjYg/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=QbMFQ58zjYg'
        },
        {
            title: '반도체 트렌드를 가장 잘 반영한 ETF! ACE 글로벌반도체TOP4 Plus',
            description: '⭐반도체 산업의 트렌드를 가장 잘 반영한 ETF ACE 글로벌반도체TOP4 Plus SOLACTIVE (446770)',
            imageUrl: 'https://i.ytimg.com/vi/-pf2TNJwBB4/maxresdefault.jpg',
            videoUrl: 'https://youtu.be/-pf2TNJwBB4?feature=shared&utm_source=therich&utm_medium=therich'
        },
        {
            title: '[28] 땡큐베리머니 : 24년 상반기는 어땠을까? (ft. 금리동향 & 인플레이션)',
            description: '땡큐👍 베리✌ 머니👌 스물여덟번째 방송! 24년 상반기 리뷰와 함께 금리 동향과 인플레이션 이슈까지 함께 살펴보겠습니다!',
            imageUrl: 'https://i.ytimg.com/vi/i-sM9ZHEZwY/maxresdefault.jpg',
            videoUrl: 'https://youtu.be/i-sM9ZHEZwY?feature=shared&utm_source=therich&utm_medium=therich'
        },
        {
            title: '[예고편] 빅테크, 새로운 IT버블? 테크 투자 ACE, 돈은 빅테크로 흐른다 저자 아담 시셀에게 물어봤습니다',
            description: '각 분야의 전문가를 만나는 ACE ETF의 FACE to FACE! ✨테크 투자 ACE는? 💁🏻‍♂️돈은 빅테크로 흐른다 저자, 아담 시셀(Adam Seessel)',
            imageUrl: 'https://i.ytimg.com/vi/LAC5l0Xo2Hk/maxresdefault.jpg',
            videoUrl: 'https://youtu.be/LAC5l0Xo2Hk?feature=shared&utm_source=therich&utm_medium=therich'
        },
    ];

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', color:'#fff' }}>
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

export default RecommendationSites;

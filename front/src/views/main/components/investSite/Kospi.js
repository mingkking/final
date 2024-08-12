import React from 'react';

const Kospi = () => {
    const videos = [
        {
            title: '주주환원의 시대가 온다! :: 주주환원 시대 숨어있는 명품 우량주로 승부하라 북콘서트 [Part 1]',
            description: '걸어다니는 리서치센터, 김기백 매니저의 주주환원 시대 명품 우량주 투자법! ',
            imageUrl: 'https://i.ytimg.com/vi/X8X7q3EyhLs/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=X8X7q3EyhLs&utm_source=therich&utm_medium=therich'
        },
        {
            title: '이건 오를 수 밖에 없어요" 이 기회를 놓치면 안 됩니다 (구해줘월부 주식상담)',
            description: '❣️ 영상 속 김현준님 도서 [사요 마요]',
            imageUrl: 'https://i.ytimg.com/vi/I8SFPPZgsHI/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=I8SFPPZgsHI&utm_source=therich&utm_medium=therich'
        },
        {
            title: '세계 1위, 유일무이한 이 주식. 전혀 팔 필요 없습니다. 빠지면 과감히 더 사 모으세요 (부자아빠 정재호 / 2부)',
            description: '📌 세계 1위, 유일무이한 이 주식. 전혀 팔 필요 없습니다. 빠지면 과감히 더 사 모으세요 (부자아빠 정재호 / 2부)',
            imageUrl: 'https://i.ytimg.com/vi/01gfZ5TQg44/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=01gfZ5TQg44&utm_source=therich&utm_medium=therich'
        },
        {
            title: '2차전지 대장주가 바뀌었다, 대장주는 단연코 이 주식이다 (박순혁 작가)',
            description: '2차전지 대장주가 바뀌었다, 대장주는 단연코 이 주식이다 (박순혁 작가 4부)',
            imageUrl: 'https://i.ytimg.com/vi/QmqhQA7TUsA/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=QmqhQA7TUsA&utm_source=therich&utm_medium=therich'
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

export default Kospi;

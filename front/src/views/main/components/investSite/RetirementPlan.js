import React from 'react';

const RetirementPlan = () => {
    const videos = [
        {
            title: '노후파산 대비할 수 있는 가장 확실한 노후준비 1개 (강창희 대표 풀버전)',
            description: '노후파산 대비할 수 있는 가장 확실한 노후준비 1개 (강창희 대표 풀버전)',
            imageUrl: 'https://i.ytimg.com/vi/M0mZwTl6a6s/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=M0mZwTl6a6s&utm_source=therich&utm_medium=therich'
        },
        {
            title: '진짜 노후준비는 이렇게 해야합니다',
            description: '☞ 렘군의 부동산 강의를 수강하려면?',
            imageUrl: 'https://i.ytimg.com/vi/5fG74k4WfTc/maxresdefault.jpg',
            videoUrl: 'https://www.youtube.com/watch?v=5fG74k4WfTc&utm_source=therich&utm_medium=therich'
        },
        {
            title: '9% 매일적금 선납이연 해봤습니다. | 선납이연을 어떻게 써야 효율적일까?',
            description: '9% 이율의 매일적금 선납이연 이자 계산과 선납이연 오해와 진실, 선납이연 활용법 등을 영상에 담았습니다',
            imageUrl: 'https://i.ytimg.com/vi/Y7X0ThS1NsE/maxresdefault.jpg',
            videoUrl: 'https://youtu.be/Y7X0ThS1NsE?si=spHyUKSpzEwUqNIp&utm_source=therich&utm_medium=therich'
        },
        {
            title: '🔥 파이어족[5] 이거만 알아도 적금 이자 2배되는 파이어족 필수 스킬, 안전 수익을 위험없이 늘려주는 스킬을 배워보자 / 파이어족의 선납이연 [번외17] [골아픔주의]',
            description: '#파이어족 #세계여행 #선납이연 #파이어족 #세계여행 #파이어스킬 #선납이연',
            imageUrl: 'https://i.ytimg.com/vi/DoHYfKxtcIw/maxresdefault.jpg',
            videoUrl: 'https://youtu.be/DoHYfKxtcIw?si=2E1R3Vq9z9E_ezUK&utm_source=therich&utm_medium=therich'
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

export default RetirementPlan;

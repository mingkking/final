import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useNavigate 추가
import EconomicNewsFeed from './todayNews/EconomicNewsFeed';
import BudongsanNews from './todayNews/BudongsanNews';
import MoneyNews from './todayNews/MoneyNews';

function TodayNews() {
    const [activeTab, setActiveTab] = useState('증권뉴스');
    const navigate = useNavigate();  // useNavigate 훅 사용

    const renderContent = () => {
        switch(activeTab) {
            case '증권뉴스':
                return <EconomicNewsFeed/>;
            case '부동산뉴스':
                return <BudongsanNews/>;
            case '경제뉴스':
                return <MoneyNews/>;
            default:
                return null;
        }
    };

    const tabStyle = (tabName) => ({
        marginRight: 10,
        padding: '10px 15px',
        cursor: 'pointer',
        borderBottom: activeTab === tabName ? '3px solid #007BFF' : '3px solid transparent',
        color: activeTab === tabName ? '#007BFF' : '#000',
        fontWeight: activeTab === tabName ? 'bold' : 'normal',
    });

    return (
        <div>
            <h2 style={{ textAlign: 'left' }}>오늘의 뉴스</h2>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd', paddingBottom: 10 }}>
                <div style={{ flex: 1, display: 'flex' }}>
                    <div onClick={() => setActiveTab('증권뉴스')} style={tabStyle('증권뉴스')}>
                        증권뉴스
                    </div>
                    <div onClick={() => setActiveTab('부동산뉴스')} style={tabStyle('부동산뉴스')}>
                        부동산뉴스
                    </div>
                    <div onClick={() => setActiveTab('경제뉴스')} style={tabStyle('경제뉴스')}>
                        경제뉴스
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', padding: '5px 10px', cursor: 'pointer'}}
                     onClick={() => navigate('/news')}  // 클릭 시 이동
                >
                    더보기
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default TodayNews;

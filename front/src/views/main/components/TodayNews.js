import React, { useState } from 'react';
import EconomicNewsFeed from './todayNews/EconomicNewsFeed';


function TodayNews() {
    const [activeTab, setActiveTab] = useState('증권뉴스');

    const renderContent = () => {
        switch(activeTab) {
            case '증권뉴스':
                return <EconomicNewsFeed/>;
            case '부동산뉴스':
                // 한국주식 컴포넌트 추가 필요
                return <div>부동산뉴스</div>;
            case '경제뉴스':
                // 한국주식 컴포넌트 추가 필요
                return <div>경제뉴스</div>;

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
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
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
            <div style={{ marginTop: 20 }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default TodayNews;

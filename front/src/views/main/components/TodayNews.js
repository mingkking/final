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
        border: activeTab === tabName ? '1px solid #007BFF' : 'none', // Show border only for active tab
        borderRadius: 5, // Optional: adds rounded corners to the border
        backgroundColor: activeTab === tabName ? '#292625' : 'transparent', // Background color for active tab
        color: activeTab === tabName ? '#F1B13C' : '#fff', // Text color for active tab
        fontWeight: activeTab === tabName ? 'bold' : 'normal',
        boxSizing: 'border-box' // Ensure padding and border are included in element's width and height
    });

    return (
        <div>
            <h2 style={{ textAlign: 'left', color: '#fff' }}>오늘의 뉴스</h2>
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: 'none', paddingBottom: 10 }} className='todayNews-tab'>
                <div style={{ flex: 1, display: 'flex' }}>
                    <div onClick={() => setActiveTab('증권뉴스')} style={tabStyle('증권뉴스')}
                         className='todayNews-tab-item'
                    >
                        증권뉴스
                    </div>
                    <div onClick={() => setActiveTab('부동산뉴스')} style={tabStyle('부동산뉴스')}
                         className='todayNews-tab-item'    
                    >
                        부동산뉴스
                    </div>
                    <div onClick={() => setActiveTab('경제뉴스')} style={tabStyle('경제뉴스')}
                         className='todayNews-tab-item'    
                    >
                        경제뉴스
                    </div>
                    <div style={{ marginLeft: 'auto', padding: '10px 10px', cursor: 'pointer', color:'#fff'}}
                     onClick={() => navigate('/news')}  // 클릭 시 이동
                     className='todayNews-tab-item'
                    >
                        더보기
                    </div>
                </div>
                
            </div>
            <div style={{ marginTop: 20 }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default TodayNews;

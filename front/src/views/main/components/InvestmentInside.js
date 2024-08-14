import React, { useState } from 'react';
import RecommendationSites from './investSite/RecommendationSites'; // 컴포넌트 경로에 맞게 수정
import Kospi from './investSite/Kospi';
import BudongsanSite from './investSite/BudongsanStie';
import RetirementPlan from './investSite/RetirementPlan';
import DividendInvesting from './investSite/DividendInvesting';

function InvestmentInside() {
    const [activeTab, setActiveTab] = useState('추천사이트');

    const renderContent = () => {
        switch(activeTab) {
            case '추천사이트':
                return <RecommendationSites />;
            case '한국주식':
                return <Kospi/>;
            case '부동산':
                return <BudongsanSite/>;
            case '노후계획':
                return <RetirementPlan/>
            case '배당투자':
                return <DividendInvesting/>;
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
            <h2 style={{ textAlign: 'left', color:'#fff' }}>투자인사이드</h2>
            <div style={{ display: 'flex', borderBottom: 'none' }} className='investmentInside-tab'>
                <div style={{ flex: 1, display: 'flex' }}>
                    <div onClick={() => setActiveTab('추천사이트')} style={tabStyle('추천사이트')} className='investmentInside-tab-item'>
                        추천사이트
                    </div>
                    <div onClick={() => setActiveTab('한국주식')} style={tabStyle('한국주식')} className='investmentInside-tab-item'>
                        한국주식
                    </div>
                    <div onClick={() => setActiveTab('부동산')} style={tabStyle('부동산')} className='investmentInside-tab-item'>
                        부동산
                    </div>
                    <div onClick={() => setActiveTab('노후계획')} style={tabStyle('노후계획')} className='investmentInside-tab-item'>
                        노후계획
                    </div>
                    <div onClick={() => setActiveTab('배당투자')} style={tabStyle('배당투자')} className='investmentInside-tab-item'>
                        배당투자
                    </div>
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default InvestmentInside;

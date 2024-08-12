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
                // 한국주식 컴포넌트 추가 필요
                return <Kospi/>;
            case '부동산':
                // 부동산 컴포넌트 추가 필요
                return <BudongsanSite/>;
            case '노후계획':
                // 노후계획 컴포넌트 추가 필요
                return <RetirementPlan/>
            case '배당투자':
                // 배당투자 컴포넌트 추가 필요
                return <DividendInvesting/>;
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
            <h2 style={{ textAlign: 'left' }}>투자인사이드</h2>
            <div style={{ display: 'flex', borderBottom: '1px solid #ddd' }}>
                <div onClick={() => setActiveTab('추천사이트')} style={tabStyle('추천사이트')}>
                    추천사이트
                </div>
                <div onClick={() => setActiveTab('한국주식')} style={tabStyle('한국주식')}>
                    한국주식
                </div>
                <div onClick={() => setActiveTab('부동산')} style={tabStyle('부동산')}>
                    부동산
                </div>
                <div onClick={() => setActiveTab('노후계획')} style={tabStyle('노후계획')}>
                    노후계획
                </div>
                <div onClick={() => setActiveTab('배당투자')} style={tabStyle('배당투자')}>
                    배당투자
                </div>
            </div>
            <div style={{ marginTop: 20 }}>
                {renderContent()}
            </div>
        </div>
    );
}

export default InvestmentInside;

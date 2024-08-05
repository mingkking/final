import React, { useState } from 'react';
import './News.css';
import Finance from './components/FinanceNews';
import RealEstate from './components/RealEstateNews';
import Economy from './components/EconomyNews';
import NewsMain from './components/NewsMain';
import axios from 'axios';

function News() {
    const [activeComponent, setActiveComponent] = useState(null);
    const [loading, setLoading] = useState(false);

    const getComponent = () => {
        switch (activeComponent) {
            case 'finance':
                return <Finance />;
            case 'realEstate':
                return <RealEstate />;
            case 'economy':
                return <Economy />;
            default:
                return <NewsMain />;
        }
    };

    const handleClickRefresh = () => {
        setLoading(true);
        try {
            // 연결을 안했는데 뭐가 성공했다는건지 성공했다고 뜸
            const response = axios.get("http://localhost:5000/news/update_news");
            alert(`새로고침 성공: ${response}`);
            console.log("새로고침 결과 값------------", response);
        } catch (error) {
            alert(`에러 발생: ${error.message}`);
            console.error("새로고침 에러:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <nav>
                <ul>
                    <li className='newsLi'>
                        <span className="assetType" onClick={() => setActiveComponent('finance')}>증권</span>
                        <span className="assetType" onClick={() => setActiveComponent('realEstate')}>부동산</span>
                        <span className="assetType" onClick={() => setActiveComponent('economy')}>경제</span>
                    </li>
                </ul>
            </nav>
            <button onClick={handleClickRefresh} disabled={loading}>{loading ? '업데이트 중...' : '새로고침'}</button>
            <div className="newsContent">
                {getComponent()}
            </div>
        </div>
    );
}

export default News;
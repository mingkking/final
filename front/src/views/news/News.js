import React, { useEffect, useState } from 'react';
import './News.css';
import Finance from './components/FinanceNews';
import RealEstate from './components/RealEstateNews';
import Economy from './components/EconomyNews';
import NewsMainGrid from './components/NewsMainGrid';
import axios from 'axios';

function News() {
    const [activeComponent, setActiveComponent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState([]);

    const getComponent = () => {
        switch (activeComponent) {
            case 'finance':
                return <Finance />;
            case 'realEstate':
                return <RealEstate />;
            case 'economy':
                return <Economy />;
            default:
                return <NewsMainGrid news={news} />;
        }
    };

    const handleClickRefresh = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/news/update_news");
            alert("새로고침 성공");
        } catch (error) {
            alert(`에러 발생: ${error.message}`);
            console.error("새로고침 에러:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        axios.get(`http://localhost:8080/news`)
        .then((result) => {
            setNews(result.data.selectRecent20News);
            console.log("가져온 뉴스 값: ", result.data);
        });
    }, []);

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
            <button onClick={handleClickRefresh} disabled={loading}>
                {loading ? '업데이트 중...' : '새로고침'}
            </button>
            <div className="newsContent">
                {getComponent()}
            </div>
        </div>
    );
}

export default News;

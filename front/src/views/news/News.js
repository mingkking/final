import React, { useState, useEffect } from 'react';
import './News.css';
import NewsMainGrid from './components/NewsMainGrid';
import NewsGrid from './components/NewsGrid'
import axios from 'axios';
import { Button, Pagination } from '@mui/material';

const News = () => {
    const [activeComponent, setActiveComponent] = useState('main'); // 기본값을 'main'으로 설정
    const [loading, setLoading] = useState(false);
    const [mainNews, setMainNews] = useState([]);
    const [financeNews, setFinanceNews] = useState([]);
    const [realEstateNews, setRealEstateNews] = useState([]);
    const [economyNews, setEconomyNews] = useState([]);
    // 페이징
    const newsPerPage = 20;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(`http://localhost:8080/news`)
            .then((result) => {
                setMainNews(result.data.selectRandom10News); // 메인 뉴스 데이터
                setFinanceNews(result.data.selectFinanceNews);
                setRealEstateNews(result.data.selectRENews);
                setEconomyNews(result.data.selectEconomyNews);
                console.log("메인 js 가져온 뉴스 값: ", result.data);
            })
            .catch((error) => {
                console.error("뉴스 데이터 가져오기 실패:", error);
            });
    }, []);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const getComponent = () => {
        switch (activeComponent) {
            case 'main':
                return <NewsMainGrid news={mainNews.slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage)} />;
            case 'finance':
                return <NewsGrid news={financeNews.slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage)} category="finance" />;
            case 'realEstate':
                return <NewsGrid news={realEstateNews.slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage)} category="realEstate" />;
            case 'economy':
                return <NewsGrid news={economyNews.slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage)} category="economy" />;
            default:
                return <NewsMainGrid news={mainNews.slice((currentPage - 1) * newsPerPage, currentPage * newsPerPage)} />;
        }
    };

    const handleClickRefresh = async () => {
        setLoading(true);
        try {
            await axios.post("http://localhost:5000/news/update_news");
            alert("새로고침 성공");
        } catch (error) {
            alert("새로고침에 실패했습니다.");
            console.error("News.js 52행 에러:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <nav>
                <ul>
                    <li className='newsLi'>
                        <span
                            className={`assetType ${activeComponent === 'main' ? 'active' : ''}`}
                            onClick={() => setActiveComponent('main')}
                        >
                            뉴스메인
                        </span>
                        <span
                            className={`assetType ${activeComponent === 'finance' ? 'active' : ''}`}
                            onClick={() => setActiveComponent('finance')}
                        >
                            증권
                        </span>
                        <span
                            className={`assetType ${activeComponent === 'realEstate' ? 'active' : ''}`}
                            onClick={() => setActiveComponent('realEstate')}
                        >
                            부동산
                        </span>
                        <span
                            className={`assetType ${activeComponent === 'economy' ? 'active' : ''}`}
                            onClick={() => setActiveComponent('economy')}
                        >
                            경제
                        </span>
                    </li>
                </ul>
            </nav>
            <div className="buttonContainer">
                <Button className="newsUpdateBtn" variant="contained" color="primary" onClick={handleClickRefresh} disabled={loading}>
                    {loading ? '업데이트 중...' : '뉴스 불러오기'}
                </Button>
            </div>
            {/* 분류선 */}
            <div style={{ borderBottom: '1px solid #c9c9c9', margin: '20px' }} /> 

            <div className="newsContent">
                {getComponent()}
            </div>
            {/* 페이지 네비게이션 */}
            <Pagination
              count={Math.ceil((activeComponent === 'main' ? mainNews : activeComponent === 'finance' ? financeNews : activeComponent === 'realEstate' ? realEstateNews : economyNews).length / newsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px'}}
            />
        </div>
    );
}

export default News;

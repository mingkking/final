import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../todayNewsCss/EconomicNewsFeed.css';  // 전통적인 CSS 파일 임포트

const EconomicNewsFeed = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.post('http://localhost:5000/flask/news/economicNewsFeed')
            .then(response => {
                if (response.data && response.data.news) {
                    setNews(response.data.news);
                }
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="economics-loading">로딩 중...</p>;
    }

    if (error) {
        return <p className="economics-error">오류: {error.message}</p>;
    }

    return (
        <div className="economics-container">
            <ul className="economics-newsList">
                {news.length === 0 ? (
                    <p className="economics-noNews">뉴스가 없습니다.</p>
                ) : (
                    news.map((item, index) => (
                        <li key={index} className="economics-newsItem">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="economics-link">
                                {item.img && (
                                    <img src={item.img} alt={item.title} className="economics-image" />
                                )}
                                <div>
                                    <h2 className="economics-title" style={{ color: '#fff' }}>{item.title}</h2>
                                    <p className="economics-date" style={{ color: '#fff' }}>{item.date}</p>
                                </div>
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default EconomicNewsFeed;

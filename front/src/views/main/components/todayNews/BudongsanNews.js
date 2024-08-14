import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../todayNewsCss/BudongsanNews.css';  // 전통적인 CSS 파일 임포트

const BudongsanNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.post('http://localhost:5000/news/budongsanNews')
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
        return <p className="budongsan-loading">로딩 중...</p>;
    }

    if (error) {
        return <p className="budongsan-error">오류: {error.message}</p>;
    }

    return (
        <div className="budongsan-container">
            <ul className="budongsan-newsList">
                {news.length === 0 ? (
                    <p className="budongsan-noNews">뉴스가 없습니다.</p>
                ) : (
                    news.map((item, index) => (
                        <li key={index} className="budongsan-newsItem">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="budongsan-link">
                                {item.img && (
                                    <img src={item.img} alt={item.title} className="budongsan-image" />
                                )}
                                <div>
                                    <h2 className="budongsan-title" style={{ color: '#fff' }}>{item.title}</h2>
                                    <p className="budongsan-date" style={{ color: '#fff' }}>{item.date}</p>
                                </div>
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default BudongsanNews;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../todayNewsCss/MoneyNews.css';  // 전통적인 CSS 파일 임포트

const MoneyNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.post('http://localhost:5000/news/moneyNews')
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
        return <p className="money-loading">로딩 중...</p>;
    }

    if (error) {
        return <p className="money-error">오류: {error.message}</p>;
    }

    return (
        <div className="money-container">
            <ul className="money-newsList">
                {news.length === 0 ? (
                    <p className="money-noNews">뉴스가 없습니다.</p>
                ) : (
                    news.map((item, index) => (
                        <li key={index} className="money-newsItem">
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="money-link">
                                {item.img && (
                                    <img src={item.img} alt={item.title} className="money-image" />
                                )}
                                <div>
                                    <h2 className="money-title">{item.title}</h2>
                                    <p className="money-date">{item.date}</p>
                                </div>
                            </a>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default MoneyNews;

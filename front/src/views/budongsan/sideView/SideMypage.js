import React, { useContext, useState, useEffect } from 'react';
import BudongsanContext from './componoets/BudongsanContext';
import './sideCss/SideMypage.css';

const SideMypage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const myPageValue = useContext(BudongsanContext);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const userNum = myPageValue.state.userNum;
                const response = await fetch('http://localhost:5000/get-favorite-properties', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_num: userNum }),
                });

                if (!response.ok) {
                    throw new Error('네트워크 응답이 실패했습니다.');
                }

                const data = await response.json();
                setProperties(data.properties);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [myPageValue.state.userNum]);

    if (loading) {
        return <div className="loader">로딩 중...</div>;
    }

    if (error) {
        return <div className="error">오류 발생: {error}</div>;
    }

    return (
        <div className="container">
            <h2>관심 등록 매물 목록</h2>
            {properties.length === 0 ? (
                <p>관심 등록한 매물이 없습니다.</p>
            ) : (
                <ul className="property-list">
                    {properties.map((property) => (
                        <li key={property.property_num} className="property-item">
                            <div className="property-details">
                                <p>
                                    <span className="address">{property.address}</span>
                                </p>
                                <p>
                                    <span className="label">아파트 이름</span>
                                    <span className="value">{property.apartMentName}</span>
                                </p>
                                <p>
                                    <span className="label">층수:</span>
                                    <span className="value">{property.floorNumber}층</span>
                                </p>
                                <p>
                                    <span className="label">거래 금액:</span>
                                    <span className="value">{property.transactionAmount} 원</span>
                                </p>
                                <p>
                                    <span className="label">건축 연도:</span>
                                    <span className="value">{property.yearBuilt}년</span>
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SideMypage;

import React, { useContext, useState, useEffect } from 'react';
import BudongsanContext from './componoets/BudongsanContext';
import './sideCss/SideMypage.css';
import Cookies from 'js-cookie';

const SideMypage = ({ onPropertySelect }) => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { state: { userNum } } = useContext(BudongsanContext);

    // useEffect(() => { 
    //     const fetchProperties = async () => {
    //         try {
    //             const response = await fetch('http://localhost:5000/get-favorite-properties', {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify({ user_num: userNum }),
    //             });

    //             if (!response.ok) {
    //                 throw new Error('네트워크 응답이 실패했습니다.');
    //             }

    //             const { properties } = await response.json();
    //             setProperties(properties);
    //         } catch (error) {
    //             setError(error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProperties();
    // }, [userNum]);

    useEffect(() => {
        // 로컬 스토리지에서 매물 리스트를 가져오려고 시도
        const cachedData = localStorage.getItem('favoriteProperties');
        if (cachedData) {
          setProperties(JSON.parse(cachedData));
          setLoading(false);
        } else {
          const fetchProperties = async () => {
            try {
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
      
              const { properties } = await response.json();
              setProperties(properties);
      
              // 가져온 매물 리스트를 로컬 스토리지에 저장
              localStorage.setItem('favoriteProperties', JSON.stringify(properties));
            } catch (error) {
              setError(error.message);
            } finally {
              setLoading(false);
            }
          };
      
          fetchProperties();
        }
      }, [userNum]);

    const handlePropertyClick = (property) => {
        if (onPropertySelect) {
            onPropertySelect(property);
        } else {
            console.error("onPropertySelect is not defined.");
        }
        console.log("Clicked property:", property);
    };

    if (loading) return <div className="loader">로딩 중...</div>;

    if (error) return <div className="error">오류 발생: {error}</div>;

    return (
        <div className="side-mypage container">
            <h2>관심 등록 매물 목록</h2>
            {properties.length === 0 ? (
                <p>관심 등록한 매물이 없습니다.</p>
            ) : (
                <ul className="property-list">
                    {properties.map((property) => (
                        <li
                            key={property.property_num}
                            className="property-item"
                            onClick={() => handlePropertyClick(property)}
                        >
                            <div className="property-details">
                                <p><span className="address">{property.address}</span></p>
                                <p><span className="label">아파트 이름:</span> <span className="value">{property.apartMentName}</span></p>
                                <p><span className="label">층수:</span> <span className="value">{property.floorNumber}층</span></p>
                                <p><span className="label">거래 금액:</span> <span className="value">{property.transactionAmount} 원</span></p>
                                <p><span className="label">건축 연도:</span> <span className="value">{property.yearBuilt}년</span></p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SideMypage;

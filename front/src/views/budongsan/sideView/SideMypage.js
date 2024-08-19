import React, { useContext, useState, useEffect } from 'react';
import BudongsanContext from './componoets/BudongsanContext'; // BudongsanContext를 불러옴
import './sideCss/SideMypage.css'; // 스타일 시트를 불러옴

const SideMypage = ({ onPropertySelect }) => {
    const [properties, setProperties] = useState([]); // 매물 리스트 상태를 초기화
    const [loading, setLoading] = useState(true); // 로딩 상태를 초기화
    const [error, setError] = useState(null); // 에러 상태를 초기화
    const { state: { userNum } } = useContext(BudongsanContext); // Context에서 userNum 값을 가져옴

    useEffect(() => {
        // 로컬 스토리지에서 매물 리스트를 삭제
        localStorage.removeItem('favoriteProperties');

        const fetchProperties = async () => {
            try {
                // 서버에서 매물 리스트를 가져옴
                const response = await fetch('http://localhost:5000/flask/get-favorite-properties', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_num: userNum }), // userNum을 포함하여 요청을 보냄
                });

                if (!response.ok) {
                    throw new Error('네트워크 응답이 실패했습니다.');
                }

                const { properties } = await response.json(); // 응답에서 매물 리스트를 파싱
                setProperties(properties); // 매물 리스트를 상태에 저장

                // 가져온 매물 리스트를 로컬 스토리지에 저장
                localStorage.setItem('favoriteProperties', JSON.stringify(properties));
            } catch (error) {
                setError(error.message); // 에러 메시지를 상태에 저장
            } finally {
                setLoading(false); // 로딩 상태를 false로 설정
            }
        };

        fetchProperties();
    }, [userNum]); // userNum이 변경될 때마다 이펙트 실행

    // 매물 클릭 핸들러
    const handlePropertyClick = (property) => {
        if (onPropertySelect) {
            onPropertySelect(property); // 매물이 선택되었을 때 콜백 함수 호출
        } else {
            console.error("onPropertySelect is not defined."); // 콜백 함수가 정의되지 않았을 때 에러 메시지 출력
        }
        console.log("Clicked property:", property); // 클릭된 매물을 콘솔에 출력
    };

    if (loading) return <div className="loader">로딩 중...</div>; // 로딩 중일 때 로딩 메시지 출력

    if (error) return <div className="error">오류 발생: {error}</div>; // 에러 발생 시 에러 메시지 출력

    return (
        <div className="side-mypage container">
            <h2 style={{color: '#fff' }}>관심 매물</h2>
            {properties.length === 0 ? (
                <p>관심 등록한 매물이 없습니다.</p> // 매물이 없을 때 메시지 출력
            ) : (
                <ul className="property-list">
                    {properties.map((property) => (
                        <li
                            key={property.property_num}
                            className="side-property-item"
                            onClick={() => handlePropertyClick(property)} // 매물 클릭 시 핸들러 호출
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

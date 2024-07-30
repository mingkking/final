import React, { useState, useEffect } from 'react';
import './sideCss/SideTransaction.css'; // CSS 파일이 제대로 임포트 되었는지 확인하세요.

const SideTransaction = ({ onPropertySelect }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // 상태 정의
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [areaMin, setAreaMin] = useState('');
    const [areaMax, setAreaMax] = useState('');

    // 매물 표시 여부 상태 추가
    const [showProperties, setShowProperties] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/budongsanAllData');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, []);

    // 가격대 최소값 변경 시 처리 함수
    const handlePriceMinChange = (e) => {
        setPriceMin(e.target.value);
        checkVisibility(); // 가격대 최소값이 변경되면 표시 여부를 확인
    }

    // 가격대 최대값 변경 시 처리 함수
    const handlePriceMaxChange = (e) => {
        setPriceMax(e.target.value);
        checkVisibility(); // 가격대 최대값이 변경되면 표시 여부를 확인
    }

    // 전용면적 최소값 변경 시 처리 함수
    const handleAreaMinChange = (e) => {
        setAreaMin(e.target.value);
        checkVisibility(); // 전용면적 최소값이 변경되면 표시 여부를 확인
    }

    // 전용면적 최대값 변경 시 처리 함수
    const handleAreaMaxChange = (e) => {
        setAreaMax(e.target.value);
        checkVisibility(); // 전용면적 최대값이 변경되면 표시 여부를 확인
    }

    // 검색어 변경 시 처리 함수
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
        checkVisibility(); // 검색어가 변경되면 표시 여부를 확인
    }

    // 조건에 맞는 매물이 있는지 확인하는 함수
    const checkVisibility = () => {
        const filtered = filteredData();
        setShowProperties(filtered.length > 0); // 매물이 하나라도 있으면 표시
    }

    // 필터링된 데이터 계산 함수
    const filteredData = () => {
        const priceMinValue = Number(priceMin) || 0;
        const priceMaxValue = Number(priceMax) || 1000000000;
        const areaMinValue = Number(areaMin) || 0;
        const areaMaxValue = Number(areaMax) || 200;

        return data.filter(property =>
            (property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.apartMentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.floorNumber.toString().includes(searchTerm)) &&
            (property.transactionAmount >= priceMinValue && property.transactionAmount <= priceMaxValue) &&
            (property.squareFootage >= areaMinValue && property.squareFootage <= areaMaxValue)
        );
    }

    const handlePropertyClick = (property) => {
        onPropertySelect(property);  // 선택된 프로퍼티를 상위 컴포넌트로 전달합니다.
    };
    
    return (
        <div>
            <form className="form-container">
                <fieldset className='fieldset-container'>
                    <legend className="mt-4">아파트 조건</legend>

                    <label htmlFor="priceMin" className="form-label">가격대 최소</label>
                    <input 
                        type="number" 
                        className="form-input" 
                        id="priceMin" 
                        value={priceMin} 
                        onChange={handlePriceMinChange} 
                        min={0}
                        max={priceMax}
                        placeholder="0"
                    />
                    <label htmlFor="priceMax" className="form-label">가격대 최대</label>
                    <input 
                        type="number" 
                        className="form-input" 
                        id="priceMax" 
                        value={priceMax} 
                        onChange={handlePriceMaxChange} 
                        min={priceMin}
                        max={1000000000}
                        placeholder="0"
                    />
                    <div className='input-value'>{priceMin}원 - {priceMax}원</div><br/>

                    <label htmlFor="areaMin" className="form-label" style={{ marginTop: '5px' }}>전용면적 최소</label>
                    <input 
                        type="number" 
                        className="form-input" 
                        id="areaMin" 
                        value={areaMin} 
                        onChange={handleAreaMinChange} 
                        min={0}
                        max={areaMax}
                        placeholder="0"
                    />
                    <label htmlFor="areaMax" className="form-label">전용면적 최대</label>
                    <input 
                        type="number" 
                        className="form-input" 
                        id="areaMax" 
                        value={areaMax} 
                        onChange={handleAreaMaxChange} 
                        min={areaMin} 
                        max={200}
                        placeholder="0"
                    />
                    <div className='input-value'>{areaMin}㎡ - {areaMax}㎡</div>
                </fieldset>
            </form>


            <div className="search-container">
                <input 
                    type="text" 
                    className="search-input" 
                    value={searchTerm} 
                    onChange={handleSearchTermChange} 
                    placeholder="주소, 아파트 이름, 층수 검색"
                />
            </div>

            {/* 매물 목록이 표시되어야 하는 경우에만 렌더링 */}
            {showProperties && (
                <div className="side-search-container-data">
                    <ul className="side-search-list" style={{ paddingLeft: '0px', textAlign: 'left'}}>
                        {filteredData().map(property => (
                            <li key={property.property_num} onClick={() => handlePropertyClick(property)}>
                                {property.address} {property.apartMentName} {property.floorNumber}층 
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SideTransaction;

import React, { useState, useEffect } from 'react';
import './sideCss/SideTransaction.css';

// 숫자에 콤마 추가하는 함수
const formatNumberWithComma = (number) => {
    if (!number) return '';
    return Number(number).toLocaleString();
};

// 숫자에서 콤마 제거하는 함수
const removeComma = (number) => {
    return number.replace(/,/g, '');
};

// 숫자를 한글 형식으로 변환하는 함수
const formatNumberToKorean = (number) => {
    if (!number) return '';
    const units = ['억', '천만', '백만', '십만', '만', '천', '백', '십', ''];
    const values = [100000000, 10000000, 1000000, 100000, 10000, 1000, 100, 10, 1];
    
    let result = '';
    let num = Number(number);
    
    for (let i = 0; i < values.length; i++) {
        const unitValue = values[i];
        if (num >= unitValue) {
            const unitNum = Math.floor(num / unitValue);
            result += (unitNum > 0 ? unitNum : '') + units[i];
            num %= unitValue;
        }
    }
    return result || '0';
};

const SideTransaction = ({ onPropertySelect }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [areaMin, setAreaMin] = useState('');
    const [areaMax, setAreaMax] = useState('');

    const [showProperties, setShowProperties] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/flask/budongsanAllData');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
            }
        };

        fetchData();
    }, []);

    const handlePriceMinChange = (e) => {
        const value = removeComma(e.target.value);
        setPriceMin(formatNumberWithComma(value)); // 여기서 formatNumberWithComma를 사용
        checkVisibility();
    }

    const handlePriceMaxChange = (e) => {
        const value = removeComma(e.target.value);
        setPriceMax(formatNumberWithComma(value)); // 여기서 formatNumberWithComma를 사용
        checkVisibility();
    }

    const handleAreaMinChange = (e) => {
        const value = removeComma(e.target.value);
        setAreaMin(formatNumberWithComma(value));
        checkVisibility();
    }

    const handleAreaMaxChange = (e) => {
        const value = removeComma(e.target.value);
        setAreaMax(formatNumberWithComma(value));
        checkVisibility();
    }

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
        checkVisibility();
    }

    const checkVisibility = () => {
        const filtered = filteredData();
        setShowProperties(filtered.length > 0);
    }

    const filteredData = () => {
        const priceMinValue = Number(removeComma(priceMin)) || 0;
        const priceMaxValue = Number(removeComma(priceMax)) || 1000000000;
        const areaMinValue = Number(removeComma(areaMin)) || 0;
        const areaMaxValue = Number(removeComma(areaMax)) || 200;

        return data.filter(property =>
            (property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.apartMentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.floorNumber.toString().includes(searchTerm)) &&
            (property.transactionAmount >= priceMinValue && property.transactionAmount <= priceMaxValue) &&
            (property.squareFootage >= areaMinValue && property.squareFootage <= areaMaxValue)
        );
    }

    const handlePropertyClick = (property) => {
        onPropertySelect(property);
    };

    const formattedPriceMin = formatNumberToKorean(removeComma(priceMin));
    const formattedPriceMax = formatNumberToKorean(removeComma(priceMax));
    

    return (
        <div>
            <form className="form-container">
                <fieldset className='fieldset-container' >
                    <legend className="mt-4" style={{color: '#fff' }}>아파트 조건</legend>

                    <label htmlFor="priceMin" className="form-label" style={{color: '#fff' }}>가격대 최소</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        id="priceMin" 
                        value={priceMin} 
                        onChange={handlePriceMinChange} 
                        placeholder="0"
                    />
                    <label htmlFor="priceMax" className="form-label" style={{color: '#fff' }}>가격대 최대</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        id="priceMax" 
                        value={priceMax} 
                        onChange={handlePriceMaxChange} 
                        placeholder="0"
                    />
                    <div className='input-value' style={{color: '#fff' }}>{formattedPriceMin} - {formattedPriceMax}원</div><br/>

                    <label htmlFor="areaMin" className="form-label" style={{ marginTop: '5px', color:'#fff'}}>전용면적 최소</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        id="areaMin" 
                        value={areaMin} 
                        onChange={handleAreaMinChange} 
                        placeholder="0"
                    />
                    <label htmlFor="areaMax" className="form-label" style={{color: '#fff' }}>전용면적 최대</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        id="areaMax" 
                        value={areaMax} 
                        onChange={handleAreaMaxChange} 
                        placeholder="0"
                    />
                    <div className='input-value' style={{color: '#fff' }}>{areaMin}㎡ - {areaMax}㎡</div>
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

            {showProperties && (
                <div className="side-search-container-data">
                    <ul className="side-search-list" style={{ paddingLeft: '0px', textAlign: 'left'}}>
                        {filteredData().map(property => (
                            <li key={property.property_num} onClick={() => handlePropertyClick(property)}
                            style={{color:'#fff'}}
                            >
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

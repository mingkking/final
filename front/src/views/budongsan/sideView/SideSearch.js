import React, { useState, useEffect } from 'react';
import './sideCss/SideSearch.css'; // CSS 파일을 import 합니다.

const SideSearch = ({ onPropertySelect }) => {  // onPropertySelect를 props로 추가합니다.
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/budongsanAllData');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredData = data.filter(property =>
        property.address.includes(searchTerm) ||
        property.apartMentName.includes(searchTerm) ||
        property.floorNumber.toString().includes(searchTerm)
    );

    const handlePropertyClick = (property) => {
        onPropertySelect(property);  // 선택된 프로퍼티를 상위 컴포넌트로 전달합니다.
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Enter 키 입력 시 폼 제출 방지
    };

    return (
        <div>
            <form className="d-flex" onSubmit={handleSubmit}>
                <input
                    className="form-control me-sm-2"
                    type="search"
                    placeholder="검색어를 입력해주세요."
                    required
                    style={{ marginBottom: '30px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <div className="side-search-container">
                <ul className="side-search-list" style={{ paddingLeft: '0px', textAlign: 'left', display: searchTerm ? 'block' : 'none' }}>
                    {filteredData.map(property => (
                        <li key={property.property_num} onClick={() => handlePropertyClick(property)}>
                            {property.address} {property.apartMentName} {property.floorNumber}층
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SideSearch;

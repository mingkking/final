import React, { useState, useEffect } from 'react';
import './sideCss/SideSearch.css'; // CSS 파일을 import 합니다.

const SideSearch = ({ onPropertySelect }) => {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/budongsanAllData');
                const jsonData = await response.json();
                
                // 데이터가 배열인지 확인 후 상태 설정
                if (Array.isArray(jsonData)) {
                    setData(jsonData);
                } else {
                    console.error('Expected an array but received:', jsonData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filteredData = data.filter(property => {
        const address = property.address.toLowerCase();
        const apartMentName = property.apartMentName.toLowerCase();
        const search = searchTerm.toLowerCase();
        return address.includes(search) || apartMentName.includes(search);
    });

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
                    style={{
                        marginBottom: '30px',
                        backgroundColor: '#BCB6AA', // Dark background color
                        color: '#000',           // White text color for contrast
                        border: '1px solid #444', // Slightly lighter border color
                        borderRadius: '4px'      // Optional: rounded corners for better appearance
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <div className="side-search-container" style={{padding: '10px', borderRadius: '4px' }}>
                <ul className="side-search-list" style={{ paddingLeft: '0px', textAlign: 'left', display: searchTerm ? 'block' : 'none', listStyleType: 'none' }}>
                    {filteredData.map(property => (
                        <li
                            key={property.property_num}
                            onClick={() => handlePropertyClick(property)}
                            style={{ color: '#fff', padding: '5px', cursor: 'pointer' }} // White color for text and pointer cursor on hover
                        >
                            {property.address} {property.apartMentName} {property.floorNumber}층
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}

export default SideSearch;

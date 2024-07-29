import React, { useState } from 'react';
import SideStarAuto from './componoets/SideStarAuto';
import Delete from '../../../imges/delete.png';
import Insert from '../../../imges/insert.png';

const SideApartment = ({ property, schoolMarkerCount, storeMarkerCount, busStationMarkerCount }) => {

  const [currentImage, setCurrentImage] = useState(Delete);

  if (!property) {
    return <div>선택된 아파트가 없습니다.</div>;
  }

  // 숫자를 천 단위로 구분하는 함수 정의
  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  // 별점 기준
  const trafficThresholds = [10, 30, 40, 50]; // 교통 시설의 별점 기준 배열
  const convenienceThresholds = [15, 30, 45, 60]; // 편의 시설의 별점 기준 배열
  const educationThresholds = [3, 6, 9, 12]; // 교육 시설의 별점 기준 배열

  const handleImageClick = () => {
    setCurrentImage((prevImage) => (prevImage === Delete ? Insert : Delete));

    // property 데이터를 서버로 전송
    fetch('/save-property', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property.property_num),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  

  return (
    <div>
      <div style={{ textAlign: 'left' }}>
        <img src={currentImage} alt="Placeholder" width="40" height="40" onClick={handleImageClick} />
      </div>
      <div className="card mb-3">
        <h3 className="card-header">{property.address}</h3>
        <div className="card-body">
          <h5 className="card-title">{property.apartMentName}</h5>
          <h6 className="card-subtitle text-muted">{property.floorNumber}층</h6>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" className="d-block user-select-none" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style={{ fontSize: '1.125rem', textAnchor: 'middle' }}>
          <rect width="100%" height="100%" fill="#868e96"></rect>
          <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
        </svg>
        <div className="card-body">
        <p className="card-text">실거래가: {formatNumber(property.transactionAmount)} 원</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">건축년도: {property.yearBuilt}</li>
          <li className="list-group-item">등록일: {property.registrationDate}</li>
          <li className="list-group-item">전용면적: {property.squareFootage}</li>
        </ul>
        <div className="card-body">
          <li className="list-group-item">도로명: {property.road_name}</li>
        </div>
      </div>
      <div className="card mb-3">
        <h3 className="card-header">별점</h3>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            교통 시설: {busStationMarkerCount}
            <SideStarAuto rating={busStationMarkerCount} thresholds={trafficThresholds} />
          </li>
          <li className="list-group-item">
            편의 시설: {storeMarkerCount}
            <SideStarAuto rating={storeMarkerCount} thresholds={convenienceThresholds} />
          </li>
          <li className="list-group-item">
            교육 시설: {schoolMarkerCount}
            <SideStarAuto rating={schoolMarkerCount} thresholds={educationThresholds} />
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideApartment;

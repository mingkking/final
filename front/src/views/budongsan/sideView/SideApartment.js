import React, { useContext, useState, useEffect } from 'react';
import Tooltip from '@mui/material/Tooltip';
import SideStarAuto from './componoets/SideStarAuto';
import Delete from '../../../imges/delete.png';
import Insert from '../../../imges/insert.png';
import BudongsanContext from './componoets/BudongsanContext';
import './sideCss/SideApartment.css'; // CSS 파일 import

const SideApartment = ({ property, schoolMarkerCount, storeMarkerCount, busStationMarkerCount }) => {
  const [currentImage, setCurrentImage] = useState(Delete);
  const budongsanValue = useContext(BudongsanContext);

  useEffect(() => {
    if (property && budongsanValue.state.userNum) {
      fetch('http://localhost:5000/check-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_num: budongsanValue.state.userNum,
          property_num: property.property_num,
        }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.isFavorite) {
            setCurrentImage(Insert);
          } else {
            setCurrentImage(Delete);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [property, budongsanValue.state.userNum]);

  if (!property) {
    return <div>선택된 아파트가 없습니다.</div>;
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const trafficThresholds = [10, 20, 30, 40];
  const convenienceThresholds = [15, 30, 45, 60];
  const educationThresholds = [3, 6, 9, 12];
  
  const trafficTooltips = ["10개 미만", "20개 미만", "30개 미만", "40개 미만", "40개 이상"];
  const convenienceTooltips = ["15개 미만", "30개 미만", "45개 미만", "60개 미만", "60개 이상"];
  const educationTooltips = ["3개 미만", "6개 미만", "9개 미만", "12개 미만", "12개 이상"];
  
  const handleImageClick = () => {
    const isInserting = currentImage === Insert;
    const endpoint = isInserting ? 'delete-property' : 'add-property';
    setCurrentImage(isInserting ? Delete : Insert);

    fetch(`http://localhost:5000/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_num: budongsanValue.state.userNum,
        property_num: property.property_num,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);

        let properties = JSON.parse(localStorage.getItem('favoriteProperties')) || [];
        if (isInserting) {
          properties = properties.filter(p => p.property_num !== property.property_num);
        } else {
          properties.push(property);
        }
        localStorage.setItem('favoriteProperties', JSON.stringify(properties));
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="scrollable-container" >
      {budongsanValue.state.userNum && (
        <div style={{ textAlign: 'left' }}>
        <Tooltip title={currentImage === Insert ? "관심매물에 삭제" : "관심매물에 추가"}>
          <img
            src={currentImage}
            alt="Favorite Toggle"
            width="40"
            height="40"
            onClick={handleImageClick}
            style={{
              cursor: 'pointer',
              filter: 'invert(1) sepia(1) saturate(5) hue-rotate(180deg)' // 이미지 색상 변경
            }}
          />
        </Tooltip>
      </div>
      )}
      <div className="card mb-3" >
        <h3 className="card-header" style={{ backgroundColor: '#202636', color: '#fff' }}>{property.address}</h3>
        <div className="card-body" style={{ backgroundColor: '#202636', color: '#fff' }}>
          <h5 className="card-title" >{property.apartMentName}</h5>
          <h6 className="card-subtitle" >{property.floorNumber}층</h6>
        </div>
        <ul className="list-group list-group-flush" >
          <li className="list-group-item" style={{ backgroundColor: '#202636', color: '#fff' }}>실거래가: {formatNumber(property.transactionAmount)} 원</li>
          <li className="list-group-item" style={{ backgroundColor: '#202636', color: '#fff' }}>건축년도: {property.yearBuilt}</li>
          <li className="list-group-item" style={{ backgroundColor: '#202636', color: '#fff' }}>등록일: {property.registrationDate}</li>
          <li className="list-group-item" style={{ backgroundColor: '#202636', color: '#fff' }}>전용면적: {property.squareFootage}</li>
        </ul>
      </div>
      {(busStationMarkerCount !== 0 || storeMarkerCount !== 0 || schoolMarkerCount !== 0) && (
        <div className="card mb-3" >
          <h3 className="card-header" style={{ backgroundColor: '#202636', color: '#fff' }}>별점</h3>
          <ul className="list-group list-group-flush">
            {busStationMarkerCount !== 0 && (
              <li className="list-group-item" style={{ backgroundColor: '#202636', color: '#fff' }}>
                교통 시설: {busStationMarkerCount}
                <SideStarAuto rating={busStationMarkerCount} thresholds={trafficThresholds} tooltips={trafficTooltips} />
              </li>
            )}
            {storeMarkerCount !== 0 && (
              <li className="list-group-item" style={{ backgroundColor: '#202636', color: '#fff' }}>
                편의 시설: {storeMarkerCount}
                <SideStarAuto rating={storeMarkerCount} thresholds={convenienceThresholds} tooltips={convenienceTooltips} />
              </li>
            )}
            {schoolMarkerCount !== 0 && (
              <li className="list-group-item" style={{ backgroundColor: '#202636', color: '#fff' }}>
                교육 시설: {schoolMarkerCount}
                <SideStarAuto rating={schoolMarkerCount} thresholds={educationThresholds} tooltips={educationTooltips} />
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SideApartment;

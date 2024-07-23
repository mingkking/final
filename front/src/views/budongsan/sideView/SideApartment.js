import React from 'react';

const SideApartment = ({ property }) => {
  if (!property) {
    return <div>선택된 아파트가 없습니다.</div>;
  }

  return (
    <div>
      <div class="card mb-3">
        <h3 class="card-header">{property.address}</h3>
        <div class="card-body">
          <h5 class="card-title">{property.apartMentName}</h5>
          <h6 class="card-subtitle text-muted">{property.floorNumber}층</h6>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" class="d-block user-select-none" width="100%" height="200" aria-label="Placeholder: Image cap" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style={{ fontSize: '1.125rem', textAnchor: 'middle' }}>
          <rect width="100%" height="100%" fill="#868e96"></rect>
          <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
        </svg>
        <div class="card-body">
          <p class="card-text">실거래가:{property.transactionAmount}</p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">건축년도: {property.yearBuilt}</li>
          <li class="list-group-item">등록익: {property.registrationDate}</li>
          <li class="list-group-item">전용면적: {property.squareFootage}</li>
        </ul>
        <div class="card-body">
          <li class="list-group-item">도로명: {property.road_name}</li>
        </div>
      </div>
      <div class="card mb-3">
        <h3 class="card-header">별점</h3>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">교통 시설: </li>
          <li class="list-group-item">편의 시설: </li>
          <li class="list-group-item">교육 시설: </li>
          <li class="list-group-item">조 망 권 : </li>
        </ul>
      </div>
    </div>
  );
}

export default SideApartment;

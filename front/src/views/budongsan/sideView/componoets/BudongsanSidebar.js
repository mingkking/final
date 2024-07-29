import React, { useState } from "react";
import '../../Budongsan.css';
import Navbar from './Navbar.js';
import '../sideCss/SideView.css';

import SideSearch from "../SideSearch.js";
import SideApartment from "../SideApartment.js";
import SideTransaction from "../SideTransaction.js";
import SideMypage from "../SideMypage.js";

const BudongsanSidebar = ({ onPropertySelect, schoolMarkerCount, storeMarkerCount, busStationMarkerCount }) => {
  const [selectedMenu, setSelectedMenu] = useState('검색'); // 기본 메뉴 설정
  const [selectedProperty, setSelectedProperty] = useState(null); // 선택된 프로퍼티 상태

  

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    onPropertySelect(property); // 부모 컴포넌트에 선택된 속성 전달
    setSelectedMenu('아파트');  // 메뉴를 '아파트'로 설정하여 SideApartment 컴포넌트로 이동
  };


  const renderComponent = () => {
    switch (selectedMenu) {
      case '검색':
        return <SideSearch onPropertySelect={handlePropertySelect} />;
      case '아파트':
        return (
          <SideApartment
            property={selectedProperty} 
            schoolMarkerCount={schoolMarkerCount}
            storeMarkerCount={storeMarkerCount}
            busStationMarkerCount={busStationMarkerCount}
          />
        ); // 선택된 프로퍼티와 마커 수를 SideApartment로 전달
      case '매물':
        return <SideTransaction onPropertySelect={handlePropertySelect} />;
      case '마이':
        return <SideMypage />;
      default:
        return null;
    }
  };

  return (
    <div>
      <header className="side-header">
        <div className="side-nav-area">
          <Navbar setSelectedMenu={setSelectedMenu} />
        </div>
      </header>
      <div className="content-area side-conponents">
        {renderComponent()}
      </div>
    </div>
  );
};

export default BudongsanSidebar;

import React, { useState } from 'react';
import KakaoMap from "./components/KaokaoMap";
import BudongsanSidebar from "./sideView/componoets/BudongsanSidebar";
import './Budongsan.css';

const Budongsan = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [schoolMarkerCount, setSchoolMarkerCount] = useState(0);
  const [storeMarkerCount, setStoreMarkerCount] = useState(0);
  const [busStationMarkerCount, setBusStationMarkerCount] = useState(0);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // 사이드바 가시성 상태

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <section>
      <button className="hamburger-menu" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`buContainer ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
        <div className="left">
          <BudongsanSidebar
            onPropertySelect={handlePropertySelect}
            schoolMarkerCount={schoolMarkerCount}
            storeMarkerCount={storeMarkerCount}
            busStationMarkerCount={busStationMarkerCount}
          />
        </div>
        <div className="right">
          <KakaoMap
            selectedProperty={selectedProperty}
            setSchoolMarkerCount={setSchoolMarkerCount}
            setStoreMarkerCount={setStoreMarkerCount}
            setBusStationMarkerCount={setBusStationMarkerCount}
          />
        </div>
      </div>
    </section>
  );
};

export default Budongsan;

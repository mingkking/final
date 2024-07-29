import React, { useState } from 'react';
import KakaoMap from "./components/KaokaoMap";
import BudongsanSidebar from "./sideView/componoets/BudongsanSidebar";
import './Budongsan.css';

const Budongsan = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [schoolMarkerCount, setSchoolMarkerCount] = useState(0);
  const [storeMarkerCount, setStoreMarkerCount] = useState(0);
  const [busStationMarkerCount, setBusStationMarkerCount] = useState(0);


  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  console.log('학교 마커 수:', schoolMarkerCount);
  console.log('상점 마커 수:', storeMarkerCount);
  console.log('버스 정류장 마커 수:', busStationMarkerCount);

  return(
    <section>
        <div>
          
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
      
    
  )
};
export default Budongsan;
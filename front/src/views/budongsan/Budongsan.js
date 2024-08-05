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
import React, { useState } from 'react';
import KakaoMap from "./components/KaokaoMap";
import BudongsanSidebar from "./sideView/componoets/BudongsanSidebar";
import './Budongsan.css';

const Budongsan = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);

  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
  };

  return(
    <section>
        <div>
          
            <div className="left">
              <BudongsanSidebar onPropertySelect={handlePropertySelect}/>
            </div>
          
          <div className="right">
            <KakaoMap selectedProperty={selectedProperty}/>
          </div>
          
        </div>
         
    </section>
      
    
  )
};
export default Budongsan;
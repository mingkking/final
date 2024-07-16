import React from "react";
import KakaoMap from "./components/KaokaoMap";
import BudongsanSidebar from "./sideView/componoets/BudongsanSidebar";
import './Budongsan.css';

const Budongsan = () => {
  return(
    <section>
        <div>
          
            <div className="left">
              <BudongsanSidebar/>
            </div>
          
          <div className="right">
            <KakaoMap/>
          </div>
          
        </div>
         
    </section>
      
    
  )
};
export default Budongsan;
import React, { useContext, useState, useEffect } from "react";
import Navbar from './Navbar.js';
import '../sideCss/SideView.css';

import SideLike from "../SideLike.js";
import SideSearch from "../SideSearch.js";
import SideApartment from "../SideApartment.js";
import SideTransaction from "../SideTransaction.js";
import SideMypage from "../SideMypage.js";
import BudongsanContext from "./BudongsanContext.js";
import axiosInstance from "../../../login/component/Token/axiosInstance.js";


const BudongsanSidebar = ({ onPropertySelect, schoolMarkerCount, storeMarkerCount, busStationMarkerCount }) => {
  const [selectedMenu, setSelectedMenu] = useState('인기'); // 기본 메뉴 설정
  const [selectedProperty, setSelectedProperty] = useState(null); // 선택된 프로퍼티 상태
  const budongsanSidebarValue = useContext(BudongsanContext);
 
  
  useEffect(() => {

    loginCheck();

  }, []);

  const loginCheck = async () => {
    const response = await axiosInstance.get('/check-login-status', {
      withCredentials: true,
    });

    if ( response.data.isLoggedIn === true) {
      budongsanSidebarValue.actions.setUserNum(response.data.userNum);
    }else{
      budongsanSidebarValue.actions.setUserNum("");
    }
  }


  const handlePropertySelect = (property) => {
    setSelectedProperty(property);
    onPropertySelect(property); // 부모 컴포넌트에 선택된 속성 전달
    setSelectedMenu('아파트');  // 메뉴를 '아파트'로 설정하여 SideApartment 컴포넌트로 이동
  };

  


  const renderComponent = () => {
    switch (selectedMenu) {
      case '인기':
        return <SideLike onPropertySelect={handlePropertySelect} />
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
        return <SideMypage onPropertySelect={handlePropertySelect}/>;
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

import React, { useState } from "react";
import '../../Budongsan.css';
import Navbar from './Navbar.js';
import '../SideView.css';

import SideSearch from "../SideSearch.js";
import SideTransaction from "../SideTransaction.js";
import SideMypage from "../SideMypage.js";

const BudongsanSidebar = () => {

  const [selectedMenu, setSelectedMenu] = useState('검색'); // 기본 메뉴 설정

  const renderComponent = () => {
    switch(selectedMenu) {
      case '검색':
        return <SideSearch />;
      case '매물':
        return <SideTransaction />;
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
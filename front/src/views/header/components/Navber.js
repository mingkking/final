
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItems from './MenuItems';
import { MenuItemsData } from '../menuItemsData';





const Navbar = () => {


  const depthLevel = 0;
  const navigate = useNavigate(); // Hook for navigation

  const handleLoginClick = () => {
    navigate('/login'); // Navigate to /login
  };



  return (

    <nav className="desktop-nav ">
      <ul className="menus">
        { MenuItemsData.map((menu, index) => (
          <MenuItems items={menu} key={index} depthLevel={depthLevel} />
        ))}
        
      </ul>
        <form className="d-flex search-form">
          <input className="form-control me-sm-2" type="search" placeholder="Search"/>
          <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
        </form>
        <button type="button" class="btn btn-light"  style={{ marginLeft: '5px' }} onClick={handleLoginClick}>로그인</button>
    </nav>
    
  );
};

export default Navbar;


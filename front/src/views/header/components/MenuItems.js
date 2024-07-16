import React from 'react';
import { Link } from 'react-router-dom';
import Dropdown from './Dropdown';
import { useState, useEffect, useRef } from "react";

const MenuItems = ({ items, depthLevel }) => {

    const [dropdown, setDropdown] = useState(false);
    let ref = useRef();


    useEffect(() => {
        const handler = (event) => {
         if (dropdown && ref.current && !ref.current.contains(event.target)) {
          setDropdown(false);
         }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
         // 이벤트 리스너 정리
         document.removeEventListener("mousedown", handler);
         document.removeEventListener("touchstart", handler);
        };
       }, [dropdown]);

       const onMouseEnter = () => {
        setDropdown(true);
       };
       
       const onMouseLeave = () => {
        setDropdown(false);
       };

    return (
        <li className="menu-items" ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
            >
        {items.submenu ? (
            <>
            <button type="button" aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => setDropdown((prev) => !prev)}
            >
                {items.title}{" "}
                {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
            </button>
            <Dropdown
            depthLevel={depthLevel}
            submenus={items.submenu}
            dropdown={dropdown} 
            />
            </>
        ) : (
            <Link to={items.url}>{items.title}</Link>
        )}
        </li>
    );
};

export default MenuItems;
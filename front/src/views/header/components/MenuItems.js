import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MenuItems = ({ items, isActive }) => {
    const ref = useRef();

    useEffect(() => {
        const handler = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                // 여기에 더 이상 dropdown을 false로 설정하는 코드를 제거했습니다.
            }
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("touchstart", handler);
        return () => {
            // 이벤트 리스너 정리
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("touchstart", handler);
        };
    }, []);

    return (
        <li className={`menu-items ${isActive ? 'active' : ''}`} ref={ref}>
            <Link to={items.url}>{items.title}</Link>
        </li>
    );
};

export default MenuItems;

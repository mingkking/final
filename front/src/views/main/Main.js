import React, { useContext } from 'react';
import MainContext from "../manager/main/contexts/MainContext";
import Main from "./components/Main";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';


function MainPage() {

    const [cookieValue, setCookieValue] = useState('');

    const value = useContext(MainContext);

    useEffect(() => {
        // 쿠키 값 가져오기
        const value = Cookies.get('accessToken');
        setCookieValue(value || '쿠키가 존재하지 않습니다.');
        console.log('cookie :>> ', value);
      }, []);

    return(
        <div>
            <h1>Main 페이지</h1>
            <Main count={value.state.todayCount}/>
            
        </div>
    );
}

export default MainPage;
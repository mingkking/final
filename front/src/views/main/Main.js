import React, { useContext } from 'react';
import MainContext from "../manager/main/contexts/MainContext";
import Main from "./components/Main";


function MainPage() {

    const value = useContext(MainContext);

    return(
        <div>
            <h1>Main 페이지</h1>
            <Main count={value.state.todayCount}/>

        </div>
    );
}

export default MainPage;
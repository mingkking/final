// src/App.js
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './views/header/components/Header';


import Ju1 from './views/stock/ju1';
import Ju2 from './views/stock/ju2';
import Co1 from './routes/co1';
import Co2 from './routes/co2';
import Budongsan from './views/budongsan/Budongsan';
import Bu2 from './routes/bu2';
import Back1 from './views/backtest/back1';
import Login from './views/login/Login';
import Chatting from './views/chat/Chatting';
import { RoomListProvider } from './views/chat/contexts/RoomListContext';
import Join from './views/login/component/Join/Join';
import IdFind from './views/login/component/find/IdFind';
import IdConfirm from './views/login/component/find/IdConfirm';
import PwFind from './views/login/component/find/PwFind';
import PwChange from './views/login/component/find/PwChange';
import Main from './views/main/Main'
import Subscribe from './views/subscribe/Subscribe1'

import Router from './routes/Router'

import { ThemeProvider } from '@mui/material';
import { baselightTheme } from "./theme/DefaultColors";

import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import { MainProvider } from './views/manager/main/contexts/MainContext';
import Community from './views/community/Community';
import { LoginProvider } from './views/login/contexts/LoginContext';




function AppContent() {
  const location = useLocation();
  const isAdminPage = Router.some(route => location.pathname.startsWith(route.path));

  const handleLoginSuccess = (userNickname) => {
    console.log('Logged in as:', userNickname);
    document.dispatchEvent(new CustomEvent('loginSuccess', { detail: userNickname }));
  };

  return (
    <>
      {!isAdminPage && <Header />}
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/ju1' element={<Ju1 />} />
        <Route path='/ju2' element={<Ju2 />} />
        <Route path='/co1' element={<Co1 />} />
        <Route path='/co2' element={<Co2 />} />
        <Route path='/budongsan' element={<Budongsan />} />
        <Route path='/bu2' element={<Bu2 />} />
        <Route path='/back1' element={<Back1 />} />
        <Route path='/Chatting' element={<Chatting />} />
        <Route path='/Community' element={<Community />} />
        <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path='/Join' element={<Join />} />
        <Route path='/IdFind' element={<IdFind />} />
        <Route path='/IdConfirm' element={<IdConfirm />} />
        <Route path='/PwFind' element={<PwFind />} />
        <Route path='/PwChange/:userId' element={<PwChange />} />
        <Route path='/Subscribe' element={<Subscribe />} />

        {/* 관리자페이지 */}
        {Router.map((route, index) => (
          <Route key={index} path={`${route.path}/*`} element={route.element}>
            {route.children && route.children.map((child, idx) => (
              <Route key={idx} path={`${child.path}`} element={child.element} />
            ))}
          </Route>
        ))}
      </Routes>


    </>
  );
}

function App() {
  const theme = baselightTheme;



  return (
    <div className="App">
      <BrowserRouter>
        <RoomListProvider>
          <LoginProvider>
            <MainProvider>
              <ThemeProvider theme={theme}>
                <AppContent />
              </ThemeProvider>
            </MainProvider>
          </LoginProvider>
        </RoomListProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
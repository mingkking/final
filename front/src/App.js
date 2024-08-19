import React, { useEffect } from 'react';
import './App.css';
import Header from './views/header/components/Header';
import Footer from './views/footer/Footer';

import Stock from './views/stock/stockMain';
import StockDetail from './views/stock/components/stockdetail/Stockdetail';
import Co1 from './routes/co1';
import Co2 from './routes/co2';
import Budongsan from './views/budongsan/Budongsan';
import Bu2 from './routes/bu2';
import Back1 from './views/backtest/Back1';
import Login from './views/login/Login';
import Chatting from './views/chat/Chatting';
import { RoomListProvider } from './views/chat/contexts/RoomListContext';
import Join from './views/login/component/Join/Join';
import IdFind from './views/login/component/find/IdFind';
import IdConfirm from './views/login/component/find/IdConfirm';
import PwFind from './views/login/component/find/PwFind';
import PwChange from './views/login/component/find/PwChange';
import Main from './views/main/Main';
import Subscribe from './views/subscribe/Subscribe1';
import Subscribe2 from './views/subscribe/Subscribe2';
import Subscribe3 from './views/subscribe/Subscribe3';
import MyPage from './views/mypage/MyPage';
import News from './views/news/News';
import DeleteMember from './views/mypage/component/DeleteMember';
import MemberPage from './views/mypage/MemberPage';
import SubscribeSuccess from './views/subscribe/SubscribeSuccess';

import Charachter from './views/main/components/Character';
import ServiceUse from './views/footer/components/ServiceUse';
import Privacy from './views/footer/components/Privacy';
import ScrollToTop from './ScrollToTip';

import DetailCommunity from './views/community/DetailCommunity';


import Router from './routes/Router';
import { ThemeProvider } from '@mui/material';
import { baselightTheme } from "./theme/DefaultColors";

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { MainProvider } from './views/manager/main/contexts/MainContext';
import Community from './views/community/Community';
import InsertCommunity from './views/community/InsertCommunity';
import { CommunityProvider } from './views/community/contexts/CommunityContext';
import { BudongsanProvider } from './views/budongsan/sideView/componoets/BudongsanContext';
import { LoginProvider } from './views/login/contexts/LoginContext';
import { SubscribeProvider } from './views/subscribe/context/SubscribeContext';
import { StockProvider } from './views/stock/components/context/StockContext';


import { Provider } from 'react-redux';
import { store } from './redux/store';



function AppContent() {
  const location = useLocation();
  const isAdminPage = Router.some(route => location.pathname.startsWith(route.path));
  const isBudongsanPage = location.pathname === '/budongsan';

  const handleLoginSuccess = (userNickname) => {
    
    document.dispatchEvent(new CustomEvent('loginSuccess', { detail: userNickname }));
  };


  return (
    <div className="App-content">
      {!isAdminPage && <Header />}
      <ScrollToTop /> {/* 페이지 이동시 스크롤 맨위로 이동 */}
      <Provider store={store}>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/stock' element={<Stock />} />
          <Route path="/stock/:stockCode" element={<StockDetail />} />
          <Route path='/co1' element={<Co1 />} />
          <Route path='/co2' element={<Co2 />} />
          <Route path='/budongsan' element={<Budongsan />} />
          <Route path='/bu2' element={<Bu2 />} />
          <Route path='/back1' element={<Back1 />} />
          <Route path='/Chatting' element={<Chatting />} />
          <Route path='/Community' element={<Community />} />
          <Route path='/InsertCommunity' element={<InsertCommunity />} />
          <Route path='/DetailCommunity' element={<DetailCommunity />} />
          <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path='/Join' element={<Join />} />
          <Route path='/IdFind' element={<IdFind />} />
          <Route path='/IdConfirm' element={<IdConfirm />} />
          <Route path='/PwFind' element={<PwFind />} />
          <Route path='/PwChange/:userId' element={<PwChange />} />
          <Route path='/Subscribe' element={<Subscribe />} />
          <Route path='/Subscribe2' element={<Subscribe2 />} />
          <Route path='/Subscribe3' element={<Subscribe3 />} />
          <Route path='/SubscribeSuccess' element={<SubscribeSuccess />}/>
          <Route path='/MyPage' element={<MyPage />} />
          <Route path='/MemberPage' element={<MemberPage />} />
          <Route path='/DeleteMember' element={<DeleteMember />} />
          <Route path='/news' element={<News />} />
          <Route path="/character/:name" element={<Charachter />} />
          <Route path="/serviceUse" element={<ServiceUse />} />
          <Route path="/privacy" element={<Privacy />} />

          {Router.map((route, index) => (
            <Route key={index} path={`${route.path}/*`} element={route.element}>
              {route.children && route.children.map((child, idx) => (
                <Route key={idx} path={`${child.path}`} element={child.element} />
              ))}
            </Route>
          ))}
        </Routes>
      </Provider>
      {!isAdminPage && !isBudongsanPage && <Footer />}
    </div>
  );
}

function App() {
  const theme = baselightTheme;
  useEffect(() => {
    // 카카오 SDK 초기화
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init('e4cf62999d49fde26a073766b0603910'); // 여기 YOUR_JAVASCRIPT_KEY를 카카오 디벨로퍼스에서 발급받은 JavaScript 키로 교체
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <LoginProvider>
          <RoomListProvider>
            <CommunityProvider>
              <BudongsanProvider>
                <StockProvider>
                  <MainProvider>
                    <SubscribeProvider>
                      <ThemeProvider theme={theme}>
                        <AppContent />
                      </ThemeProvider>
                    </SubscribeProvider>
                  </MainProvider>
                </StockProvider>
              </BudongsanProvider>
            </CommunityProvider>
          </RoomListProvider>
        </LoginProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

// src/App.js
import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './views/header/components/Header';

import Ju1 from './routes/ju1';
import Ju2 from './routes/ju2';
import Co1 from './routes/co1';
import Co2 from './routes/co2';
import Budongsan from './views/budongsan/Budongsan';
import Bu2 from './routes/bu2';
import Back1 from './routes/back1';
import Comu1 from './routes/comu1';
import Login from './routes/login';
import Chatting from './views/chat/Chatting';
import { RoomListProvider } from './views/chat/contexts/RoomListContext';


import {
  BrowserRouter, Routes, Route
} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <RoomListProvider>
          <Header />
          <Routes>
            <Route path='/ju1' element={<Ju1 />} />
            <Route path='/ju2' element={<Ju2 />} />
            <Route path='/co1' element={<Co1 />} />
            <Route path='/co2' element={<Co2 />} />
            <Route path='/budongsan' element={<Budongsan />} />
            <Route path='/bu2' element={<Bu2 />} />
            <Route path='/back1' element={<Back1 />} />
            <Route path='/Chatting' element={<Chatting />} />
            <Route path='/comu1' element={<Comu1 />} />
            <Route path='/login' element={<Login />} />



          </Routes>
        </RoomListProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

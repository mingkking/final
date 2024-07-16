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
import Login from './views/login/Login';
import Chatting from './views/chat/Chatting';
import { RoomListProvider } from './views/chat/contexts/RoomListContext';
import Join from './views/login/component/Join/Join';

import Router from './routes/Router'

import { ThemeProvider } from '@mui/material';
import { baselightTheme } from "./theme/DefaultColors";

import { useState } from 'react';
import {
  BrowserRouter, Routes, Route, useLocation
} from 'react-router-dom'

// function App() {

//   const theme = baselightTheme;

//   const handleLoginSuccess = (userNickname) => {
//     console.log('Logged in as:', userNickname);
// };

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <RoomListProvider>
//         <ThemeProvider theme={theme}>
//           <Header />
//           <Routes>
//             <Route path='/ju1' element={<Ju1 />} />
//             <Route path='/ju2' element={<Ju2 />} />
//             <Route path='/co1' element={<Co1 />} />
//             <Route path='/co2' element={<Co2 />} />
//             <Route path='/budongsan' element={<Budongsan />} />
//             <Route path='/bu2' element={<Bu2 />} />
//             <Route path='/back1' element={<Back1 />} />
//             <Route path='/Chatting' element={<Chatting />} />
//             <Route path='/comu1' element={<Comu1 />} />
//             <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
//             <Route path='/Join' element={<Join/>}/>

            
//             {/* 관리자페이지 */}
//             {Router.map((route, index) => (
//               <Route key={index} path={`${route.path}`} element={route.element}>
//                 {route.children && route.children.map((child, idx) => (
//                   <Route key={idx} path={`${child.path}`} element={child.element} />
//                 ))}
//               </Route>
//             ))}

//           </Routes>
//           </ThemeProvider>
//         </RoomListProvider>
//       </BrowserRouter>
//     </div>
//   );
// }

// export default App;


function AppContent() {
  const location = useLocation();
  const isAdminPage = Router.some(route => location.pathname.startsWith(route.path));

  const handleLoginSuccess = (userNickname) => {
    console.log('Logged in as:', userNickname);
  };

  return (
    <>
      {!isAdminPage && <Header />}
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
             <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
             <Route path='/Join' element={<Join/>}/>
        
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
          <ThemeProvider theme={theme}>
            <AppContent />
          </ThemeProvider>
        </RoomListProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
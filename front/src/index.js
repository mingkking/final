import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './bootstrap.min.css';
import ReactModal from 'react-modal';

import reportWebVitals from './reportWebVitals';

ReactModal.setAppElement('#root'); // 이 줄을 추가하세요.
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

reportWebVitals();

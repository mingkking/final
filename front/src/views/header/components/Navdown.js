import React from 'react';
import { Link } from 'react-router-dom';

function Navdown({ show, onClose, onLogout }) {

    return (
        <div className="dropdown-menu">
        <ul>
          <li><Link to="/MyPage" onClick={onClose}>마이페이지</Link></li>
          <li><Link to="/" onClick={onClose}>프로필 수정</Link></li>
          <li><Link to="/" onClick={onClose}>비밀번호 변경</Link></li>
          <li><button onClick={() => { onLogout(); onClose(); }}>회원 탈퇴</button></li>
        </ul>
      </div>
    );
  }
  
  export default Navdown;
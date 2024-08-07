import React, { useContext } from 'react';
import './NavBar.css'; // CSS 파일을 임포트합니다.
import RoomListContext from '../../contexts/RoomListContext';
import socket from '../../server';
import { Tooltip } from '@mui/material';

const NavBar = () => {
    const value = useContext(RoomListContext);                // 채팅 방 Context 객체 생성

    const leaveRoom = () => {                                 // 방 나가기 함수
        socket.emit("leaveRoom", value.state.user, (res) => { // 방 나가기 node서버로 요청

            if (res.ok) {                                     // 서버에 방 나가기 요청 후 응답이 true일 때
                value.actions.setUser(null);

            }

        });
    }

    return (
        // 채팅 방의 네비게이션 바
        <nav className="navbar">

            {/* 방 나가기 함수 버튼 */}
            <Tooltip title={"나가기"}>
                <button onClick={leaveRoom} className="back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-left">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
            </Tooltip>
            {/* 방 나가기 함수 버튼 */}

            {/* 방 정보들 map */}
            {
                value.state.rooms.map((room, index) => {
                    if (room._id === value.state.user.room) {                       // 방 id === 접속한 유저가 들어가 있는 방번호
                        return (
                            <div className="nav-user" key={index}>{room.room}</div> // 방 제목
                        )
                    }
                })
            }
            {/* 방 정보들 map */}

            {/* 메뉴버튼 */}
            <div className="nav-drop"></div>
            {/* 메뉴버튼 */}

        </nav>
        // 채팅 방의 네비게이션 바
    );
};

export default NavBar;
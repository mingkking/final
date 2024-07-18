import React, { useContext } from 'react';
import './NavBar.css'; // CSS 파일을 임포트합니다.
import RoomListContext from '../../contexts/RoomListContext';
import socket from '../../server';

const NavBar = ({ }) => {
    const value = useContext(RoomListContext);

    const leaveRoom = () => {
        socket.emit("leaveRoom", value.state.user, (res) => {
            console.log(value.state.rooms);
            console.log(value.state.user.room);

            value.state.rooms.map((room, index) => {
                if (room._id === value.state.user.room) {
                    console.log(room.room);
                }
            })

            if (res.ok) {
                value.actions.setUser(null);
            }// 다시 채팅방 리스트 페이지로 돌아감
        });
    }

    return (
        <nav className="navbar">
            <button onClick={leaveRoom} className="back-button">
                &lt;
            </button>
                {
                    value.state.rooms.map((room, index) => {
                        if (room._id === value.state.user.room) {
                            return (
                                <div className="nav-user" key={index}>{room.room}</div>
                            )
                        }
                    })
                }
            <div className="nav-drop">메뉴</div>
        </nav>
    );
};

export default NavBar;
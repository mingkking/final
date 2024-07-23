import React, { useContext } from 'react';
import './NavBar.css'; // CSS 파일을 임포트합니다.
import RoomListContext from '../../contexts/RoomListContext';
import socket from '../../server';

const NavBar = ({ }) => {
    const value = useContext(RoomListContext);

    // 방 나가기
    const leaveRoom = () => {
        socket.emit("leaveRoom", value.state.user, (res) => { // 방 나가기 node서버로 요청
            console.log(value.state.rooms); // 방 정보들 값 확인
            console.log(value.state.user.room); // 접속한 유저의 방번호 값 확인

            value.state.rooms.map((room, index) => {
                if (room._id === value.state.user.room) {
                    console.log(room.room);
                }
            })

            if (res.ok) {
                console.log(res.result);
                // if(res.result === 0){
                    value.actions.setUser(null);
                // }else{

                // }
                
            }// 다시 채팅방 리스트 페이지로 돌아감
        });
    }

    return (
        <nav className="navbar">
            <button onClick={leaveRoom} className="back-button"> {/* 방 나가기 */}
                &lt;
            </button>
                {
                    value.state.rooms.map((room, index) => { // 방 정보들 map
                        if (room._id === value.state.user.room) { // 방 id === 접속한 유저가 들어가 있는 방번호
                            return (
                                <div className="nav-user" key={index}>{room.room}</div> // 방 제목
                            )
                        }
                    })
                }
            <div className="nav-drop">메뉴</div> {/* 메뉴바 */}
        </nav>
    );
};

export default NavBar;
import React, { useContext, useEffect, useState } from "react";
import socket from "../../server";
import { useNavigate } from "react-router-dom";
import "./RoomList.css";
import RoomListContext from "../../contexts/RoomListContext";
import LoginContext from "../../../login/contexts/LoginContext";
import axios from "axios";


const RoomList = () => {
    const loginValue = useContext(LoginContext);                // 로그인 Context 객체 생성
    const value = useContext(RoomListContext);                  // 채팅 방 Context 객체 생성

    useEffect(() => {                                           // 처음 한번 실행하는 훅

        socket.emit("rooms", (res) => {                         // 전체 방의 정보들을 요청
            value.actions.setRooms(res.data);                   // 전체 방의 정보들을 Context 변수에 저장
        });

    }, []);

    useEffect(() => {                                           // 방의 정보들이 바뀔때마다 실행하는 훅
        
        socket.emit("rooms", (res) => {                         // 전체 방의 정보들을 요청
            value.actions.setRooms(res.data);                   // 전체 방의 정보들을 Context 변수에 저장
        });

    }, [value.state.rooms]);

    const moveToChat = (rid) => {                               // 채팅 방 입장 함수 rid = 방의 PK
        
        if (!value.state.user) {                                // 채팅 유저 정보가 없을 경우

            const userName = loginValue.state.afterLoginNick;                 // test용 추후 아이디 또는 닉네임 값으로 변경 예정
            
            socket.emit("joinRoom", rid, userName, (res) => {   // 서버에 방 참여 요청

                if (res && res.ok) {                            // 요청 후 응답이 true일 때

                    value.actions.setUser(res.data);            // 유저 정보를 Context 변수에 저장
                    
                    socket.emit("rooms", (res) => {             // 전체 방의 정보들을 요청
                        value.actions.setRooms(res.data);       // 전체 방의 정보들을 Context 변수에 저장
                    });

                }
            })
        }
    };

    const createRoom = (e) => {                                                                     // 채팅방 생성 함수

        e.preventDefault();                                                                         // 버튼 고유 이벤트 삭제
        const roomName = prompt("채팅방 제목을 입력해주세요.");                                       // 채팅방 제목 입력

        if (roomName) {                                                                             // 채팅방 이름을 입력했을 경우

            axios.get("/createRoom", {                                                              // createRoom 경로를 요청하면 http://localhost:5001/ 요청
                params: { roomName: roomName, socketId: socket.id, userName: loginValue.state.afterLoginNick } // params 객체 data
            })
                .then((result) => {                                                                 // axios 방 생성 요청 이후 함수 실행

                    if (result.data.ok) {                                                           // axios 요청이 성공했을 경우

                        socket.emit("joinRoom", result.data.room, result.data.user.name, (res) => { // node서버로 방 참여 요청

                            if (res.ok) {                                                           // 방 접속이 성공했을 경우

                                value.actions.setUser(res.data);                                    // 유저 정보 context에 저장

                                socket.emit("rooms", (res) => {                                     // 전체 방의 정보들을 요청
                                    value.actions.setRooms(res.data);                               // 전체 방의 정보들을 Context 변수에 저장
                                });

                            }

                        })

                    }

                });

        }
       
    }

    return (
        //  채팅 방 리스트
        <div className="room-body">

            {/* 채팅 방 리스트 네비게이션 바 */}
            <div className="room-nav">
                <div className="room-nav-chat">채팅 ▼</div>
                <button className="room-nav-create" onClick={createRoom}>+</button>
            </div>
            {/* 채팅 방 리스트 네비게이션 바 */}

            {/* 전체 방 리스트 목록 */}
            {value.state.rooms.length > 0

                // 전체 방의 정보들이 있을 경우
                ? value.state.rooms.map((room) => (
                    <div
                        className="room-list"
                        key={room._id}
                        onClick={() => moveToChat(room._id)}
                    >
                        <div className="room-title">
                            <img src="/profile.jpeg" alt="Profile" />
                            <p>{room.room}</p>
                        </div>
                        <div className="member-number">{room.members.length}</div>
                    </div>
                ))
                // 전체 방의 정보들이 있을 경우

                // 전체 방의 정보가 없을 경우
                : null}
                {/* 전체 방의 정보가 없을 경우 */}

            {/* 전체 방 리스트 목록 */}

        </div>
        //  채팅 방 리스트
    );
};

export default RoomList;
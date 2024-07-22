import React, { useContext, useEffect, useState } from "react";
import socket from "../../server";
import { useNavigate } from "react-router-dom";
import "./RoomList.css";
import RoomListContext from "../../contexts/RoomListContext";
import axios from "axios";

const RoomList = () => {
    const value = useContext(RoomListContext);

    useEffect(() => {
        // 채팅 방 리스트 받아오기
        socket.emit("rooms", (res) => {
            value.actions.setRooms(res.data);
        });
    }, []);

    useEffect(() => {
        // 채팅 방 리스트 받아오기
        socket.emit("rooms", (res) => {
            value.actions.setRooms(res.data);
        });
    }, [value.state.rooms]);

    // 채팅 방 입장
    const moveToChat = (rid) => {
        // 채팅 유저 정보가 없을 경우
        if (!value.state.user) {
            const userName = prompt("이름입력");

            // 방 참여
            socket.emit("joinRoom", rid, userName, (res) => {
                if (res && res.ok) {
                    value.actions.setUser(res.data);
                    // 채팅방 업데이트
                    socket.emit("rooms", (res) => {
                        value.actions.setRooms(res.data);
                    });
                }
            })
        }
    };

    // 채팅방 생성
    const createRoom = (e) => {
        e.preventDefault(); // 버튼 고유 이벤트  삭제
        const roomName = prompt("채팅방 제목을 입력해주세요.");

        // 채팅방의 이름 존재
        if (roomName) {
            axios.get("/createRoom", { // createRoom 경로를 요청하면 http://localhost:5001/ 요청
                params: { roomName: roomName } // params 객체 data
            })
                .then((result) => console.log("ok", result.data));
        }
        // 채팅방의 이름 존재
    }
    // 채팅방 생성

    return (
        <div className="room-body">
            <div className="room-nav">
                <div className="room-nav-chat">채팅 ▼</div>
                <button className="room-nav-create" onClick={createRoom}>+</button>
            </div>
            {value.state.rooms.length > 0
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
                : null}
        </div>
    );
};

export default RoomList;
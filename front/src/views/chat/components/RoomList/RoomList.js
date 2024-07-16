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
            console.log(res.data);
            console.log(value.state.user);
            value.actions.setRooms(res.data);
        });
    }, []);

    // 채팅방 업데이트
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
                    console.log("successfully join", res);
                    value.actions.setUser(res.data);
                }
                else {
                    console.log("fail to join", res);
                }
            })
        }
    };

    return (
        <div className="room-body">
            <div className="room-nav">채팅 ▼</div>
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
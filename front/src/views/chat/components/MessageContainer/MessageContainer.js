import React, { useEffect, useState, useContext } from "react";
import "./MessageContainer.css";
import { Container } from "@mui/system";
import RoomListContext from "../../contexts/RoomListContext";

const MessageContainer = ({ messageList, user }) => {
    const value = useContext(RoomListContext);

    // 채팅 방 입장 시간 저장 변수
    const [preDate, setPreDate] = useState(null);

    // 처음 한번 채팅방 입장 시간 변수에 넣기
    useEffect(() => {
        console.log("접속한 유저 방 번호: ", value.state.user.room);
    }, []);


    useEffect(() => {
        setPreDate(new Date()); // 채팅 방 입장 시간
        // console.log("방들의 정보: ", value.state.rooms);
        // console.log("접속한 유저 방 번호: ", value.state.user.room);
        // if (value.state.messageList !== null) {
        //     console.log("value.state.messageList", value.state.messageList);
        //     for (let i = 0; i < value.state.messageList.length; i++) {
        //         if(value.state.messageList[i].user.room !== undefined){
        //             console.log("value.state.messageList[i].user.room system",value.state.messageList[i].user.room);
        //         }else{
        //             console.log("value.state.messageList[i].user.room user",value.state.messageList[i].user.room);
        //         }
        //     }
        // }
        console.log(value.state.messageList);
    }, [value.state.messageList]);

    return (
        <div>
            {/* 채팅리스트 맵 돌리기 시작 */}
            {value.state.messageList.map((message, index) => {

                // (유저의 방번호와 채팅리스트의 방번호가 같거나) || (채팅리스트 방번호가 존재 && 유저 방 번호 === 채팅리스트 방 번호)
                if (value.state.user.room === message.room || ((message.user.room !== undefined) && (value.state.user.room === message.user.room))) {

                    // 시스템 시간 변수 = 
                    let isSystemTime = new Date(preDate).getDate() !== new Date(message.createdAt).getDate();
                    return (
                        <Container key={index} className="message-container">

                            {/* 입장할 때 시스템 메세지로 날짜와 시간 출력 */}
                            {isSystemTime && (
                                <div className="system-message-container">
                                    <p className="system-message">
                                        {new Date(preDate).toLocaleDateString('kr-US', {
                                            year: 'numeric',
                                            month: 'long', 
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        })}
                                    </p>
                                </div>
                            )}
                            {/* 입장할 때 시스템 메세지로 날짜와 시간 출력 */}

                            {/* 채팅리스트 중 유저 이름 === system */}
                            {message.user.name === "system" ? (
                                <div className="system-message-container">
                                    <p className="system-message">{message.chat}</p>
                                </div>
                                
                            )
                            // 채팅리스트 중 유저 이름 === system

                            // 채팅리스트 중 유저 이름 === 현재 접속중인 유저 이름
                            : message.user.name === user.name ? (
                                <div className="my-message-container">
                                    <div className="message-time">{new Date(message.createdAt).toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}</div>
                                    <div className="my-message">
                                        {message.chat}
                                    </div>
                                </div>
                            ) 
                            // 채팅리스트 중 유저 이름 === 현재 접속중인 유저 이름

                            // 채팅리스트 중 유저 이름 !== 현재 접속중인 유저 이름
                            : (
                                <div className="your-message-container">
                                    <div className="profile-image">
                                        <img src="/profile.jpeg" className="profile-image" />
                                    </div>
                                    <div className="message-content">
                                        <div className="message-label">{message.user.name}</div>
                                        <div className="your-message">{message.chat}</div>
                                    </div>
                                    <div className="message-time">{new Date(message.createdAt).toLocaleString('en-US', {
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}</div>
                                </div>
                            )}
                            {/* 채팅리스트 중 유저 이름 !== 현재 접속중인 유저 이름 */}
                        </Container>
                    );
                }
                // (유저의 방번호와 채팅리스트의 방번호가 같거나) || (채팅리스트 방번호가 존재 && 유저 방 번호 === 채팅리스트 방 번호)
            })}
            {/* 채팅리스트 맵 돌리기 시작 */}
        </div>
    );
};

export default MessageContainer;
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
        // setPreDate(messageList[messageList.length-1].timestamp);
        setPreDate(new Date());
        console.log(value.state.rooms._id);
        console.log(value.state.user.room);
        console.log(messageList["room"]);
    }, []);

    return (
        <div>
            {messageList.map((message, index) => {
                let isSystemTime = new Date(preDate).getDate() !== new Date(message.createdAt).getDate();
                return (
                    <Container key={index} className="message-container">
                        {/* 날짜가 바뀌면 시스템 메시지로 날짜를 표시 */}
                        {isSystemTime && (
                            <div className="system-message-container">
                                <p className="system-message">
                                    {new Date(preDate).toLocaleDateString('kr-US', {
                                        year: 'numeric',
                                        month: 'long', // "long" for full month name
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true
                                    })}
                                </p>
                            </div>
                        )}
                        {message.user.name === "system" ? (
                            <div className="system-message-container">
                                <p className="system-message">{message.chat}</p>
                            </div>
                        ) : message.user.name === user.name ? (
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
                        ) : (
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
                    </Container>
                );
            })}
        </div>
    );
};

export default MessageContainer;
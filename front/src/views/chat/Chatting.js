import * as React from 'react';
import { Container, Grid, Card, CardContent, Box, Table, TableRow, TableCell, Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Link, useNavigate } from 'react-router-dom';
import socket from './server';
import { useEffect } from 'react';
import "./Chatting.css";
import InputField from './components/InputField/InputField';
import MessageContainer from './components/MessageContainer/MessageContainer';
import RoomList from './components/RoomList/RoomList';
import { useContext } from 'react';
import RoomListContext from './contexts/RoomListContext';
import axios from 'axios';
import NavBar from './components/NavBar/NavBar';

const Chatting = ({ props, user }) => {
    const value = useContext(RoomListContext);                                      // 채팅 방 Context 객체 생성
    const [message, setMessage] = React.useState("");                               // 채팅 방 입력 필드
    const messageContainerRef = React.useRef(null);                                 // 채팅 방 스크롤 
    const [reverseLayout, setReverseLayout] = React.useState(false);                // 채팅 방 스크롤

    useEffect(() => {                                                               // 처음 한번 실행하는 훅
        
        const messageHandler = (message) => {                                       // 메시지 이벤트 리스너 등록
            value.actions.setMessageList((prevState) => [...prevState, message]);
        };

        socket.on("message", messageHandler);                                       // 서버에서 리액트로 message 요청을 받음

        return () => {                                                              // 컴포넌트 언마운트 시 이벤트 리스너 정리
            socket.off("message", messageHandler);
        };

    }, []);

    useEffect(() => {                                                               // 메세지리스트가 변화가 생길 때 스크롤을 이동시킴

        const container = messageContainerRef.current;                              // 메세지컨테이너 DOM 요소 참조

        if (container && reverseLayout) {                                           // 컨테이너가 존재하고 reverseLayout이 true일 때
            container.scrollTop = container.scrollHeight;                           // 컨테이너의 scrollTop을 scrollHeight로 설정
        }

    }, [value.state.messageList, reverseLayout]);

    const sendMessage = (event) => {                                                // 메세지입력 함수

        event.preventDefault();                                                     // 고유이벤트 삭제

        socket.emit("sendMessage", message, value.state.user, (res) => {            // 서버에 센드메세지 요청
            if (res?.ok) {                                                          // 서버에서 응답이 true일 때
                setMessage("");                                                     // 채팅 방 입력 필드 비우기
            }
        });

    }
    
    // 유저 정보가 있을 경우
    if (value.state.user && value.state.rooms) {
        return (
            // 채팅 컨테이너
            <div className="container" style={{ margin: "50px auto" }}>
                <div className="row">

                    {/* 채팅 방 목록 조회 */}
                    <div className="col-lg-5 col-md-12 card cardCustom">
                        
                        <div className='row roomContainer'>
                            <RoomList /> {/* 채팅 방 목록 조회 컴포넌트 */}
                        </div>

                    </div>
                    {/* 채팅 방 목록 조회 */}

                    {/* 채팅 방 메세지 컨테이너 */}
                    <div className="col-lg-7 col-md-12 card cardCustom">

                        <NavBar />                                                                             {/* 메세지 컨테이너 네비게이션 컴포넌트*/}
                        <div className='row chatContainer' style={{ paddingBottom: 50 }}>
                            <MessageContainer messageList={value.state.messageList} user={value.state.user} /> {/* 메세지 컨테이너 채팅내용 컴포넌트 */}
                        </div>
                        <div className='row' style={{ width: "100%" }}>
                            <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} /> {/* 메세지 컨테이너 입력 필드 컴포넌트 */}
                        </div>

                    </div>
                    {/* 채팅 방 메세지 컨테이너 */}

                </div>
            </div>
            // 채팅 컨테이너
        )
    // 유저 정보가 있을 경우

    // 유저 정보가 없을 경우
    } else {
        return (
            // 채팅 컨테이너
            <div className="container" style={{ margin: "50px auto" }}>
                <div className="row">

                    {/* 채팅 방 목록 조회 */}
                    <div className="col-lg-5 col-md-12 card cardCustom">

                        <div className='row roomContainer'>
                            <RoomList /> {/* 채팅 방 목록 조회 컴포넌트 */}
                        </div>

                    </div>
                    {/* 채팅 방 목록 조회 */}

                </div>
            </div>
            // 채팅 컨테이너
        )
    }
    // 유저 정보가 없을 경우
}

export default Chatting;
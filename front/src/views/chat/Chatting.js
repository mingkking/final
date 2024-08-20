import * as React from 'react';
import { Container, Grid, Card, CardContent, Box, Table, TableRow, TableCell, Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import socket from './server';
import { useEffect } from 'react';
import "./Chatting.css";
import InputField from './components/InputField/InputField';
import MessageContainer from './components/MessageContainer/MessageContainer';
import RoomList from './components/RoomList/RoomList';
import { useContext } from 'react';
import RoomListContext from './contexts/RoomListContext';
import NavBar from './components/NavBar/NavBar';
import LoginContext from '../login/contexts/LoginContext';
import axiosInstance from '../login/component/Token/axiosInstance';
import axios from 'axios';

const Chatting = ({ props, user }) => {
    const navigate = useNavigate();
    const value = useContext(RoomListContext);                                           // 채팅 방 Context 객체 생성
    const loginValue = useContext(LoginContext);                                         // 로그인 Context 객체 생성
    const [message, setMessage] = React.useState("");                                    // 채팅 방 입력 필드
    const messageContainerRef = React.useRef(null);                                      // 채팅 방 스크롤 
    const [reverseLayout, setReverseLayout] = React.useState(false);                     // 채팅 방 스크롤

    useEffect(() => {                                                                    // 처음 한번 실행하는 훅

        loginCheck();                                                                    // 로그인 판단 함수

        const messageHandler = (message) => {                                            // 메시지 이벤트 리스너 등록
            value.actions.setMessageList((prevState) => [...prevState, message]);
        };

        socket.on("message", messageHandler);                                            // 서버에서 리액트로 message 요청을 받음

        return () => {                                                                   // 컴포넌트 언마운트 시 이벤트 리스너 정리
            socket.off("message", messageHandler);
        };

    }, []);

    const loginCheck = async () => {

        const response = await axiosInstance.get('/check-login-status', {                // 로그인 상태 요청
            withCredentials: true,                                                       // 쿠키 포함 요청
        });
        
        if (response.data.isLoggedIn === true) {                                          // 로그인이 되어 있을 경우
            value.actions.setChatUserNick(response.data.userNickname);                    // 로그인 닉네임 저장

            // 비동기때문에 await 후 값 받아와서 subscribeTF 에 담기
            const subscribeTF = await checkSubcribe(response.data.userNum);

            if (!subscribeTF) {
                alert('구독 후 이용해주세요!');
                navigate('/Subscribe');
            }
        } else {                                                                          // 로그인이 되어 있지 않을 경우
            alert("로그인 및 구독 후 이용해주세요!");                                       // 로그인 또는 구독 하라고 하는 경고창 띄우기
            navigate("/login");                                                           // 로그인 화면으로 이동시키기
        }

    }

    // 구독 확인 springboot에서 값 받아오는 함수
    const checkSubcribe = async (user_num) => {

        // 로그인 한 유저의 user_num 을 springboot로 넘김
        const result = await axios.get(`http://localhost:8080/subscribe/${user_num}`);
        // boolean 값으로 result.data 값이 1이면 true, 아니면 false로 return
        return result.data === 1;
    }

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
                    <div className="col-lg-5 col-md-12 cardCustom">

                        <div className='row roomContainer'>
                            <RoomList /> {/* 채팅 방 목록 조회 컴포넌트 */}
                        </div>

                    </div>
                    {/* 채팅 방 목록 조회 */}

                    {/* 채팅 방 메세지 컨테이너 */}
                    <div className="col-lg-7 col-md-12 cardCustom">

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
                    <div className="col-lg-5 col-md-12 cardCustom">

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
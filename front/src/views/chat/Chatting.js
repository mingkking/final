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
    const navigate = useNavigate();
    const value = useContext(RoomListContext);

    // 메세지입력 창
    const [message, setMessage] = React.useState("");

    // 메세지의 내용이 추가될 때마다 채팅 방의 스크롤을 제일 밑에쪽을 가리키게 함
    const messageContainerRef = React.useRef(null);
    const [reverseLayout, setReverseLayout] = React.useState(false);

    // 전체 메세지 저장
    const [messageList, setMessageList] = React.useState([]);

    // 처음에 한번 동작하는 훅
    useEffect(() => {
        // 접속했던 session id 가져오기
        // axios.get('http://localhost:5001/getSession', { withCredentials: true })
        // .then((response) => {
        //     console.log('Session get', response);
        // })
        // .catch(error => {
        //     console.error('Error getting session', error);
        // });
        

        // 서버가 모든 클라이언트에게 보내는 메세지 확인
        let i = 0;
        socket.on("message", (message) => {
            i++;
            console.log(i);
            console.log("메세지 ", message);
            // 전체 메세지 저장
            setMessageList((prevState) => prevState.concat(message));
        });

    }, []);

    // 유저 정보 업데이트
    // useEffect(() => {
    // }, [value.state.user]);

    // 메세지리스트가 변화가 생길 때 스크롤을 이동시킴
    useEffect(() => {
        const container = messageContainerRef.current;
        if (container && reverseLayout) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messageList, reverseLayout]);

    // 메세지입력 함수
    const sendMessage = (event) => {
        event.preventDefault();
        socket.emit("sendMessage", message, value.state.user, (res) => {
            if (res?.ok) {
                setMessage("");
            }
        });
    }

    if (value.state.user) {
        return (
            <div className="container" style={{ margin: "50px auto" }}>
                <div className="row">

                    <div className="col-lg-5 col-md-12 card cardCustom">
                        {/* <h5><Link onClick={chatRoomJoin}>더리치 포트폴리오 토론방 7389</Link></h5>
                                    <h6>올해는 작년보다 더 좋을듯 ' 방금 전</h6> */}
                        <div className='row roomContainer'>
                            <RoomList />
                        </div>
                    </div>

                    <div className="col-lg-7 col-md-12 card cardCustom">
                        <NavBar />
                        <div className='row chatContainer' style={{ paddingBottom: 50 }}>
                            <MessageContainer messageList={messageList} user={value.state.user} />
                        </div>
                        <div className='row' style={{ width: "100%" }}>
                            <InputField message={message} setMessage={setMessage} sendMessage={sendMessage} />
                        </div>
                    </div>

                </div>
            </div>
        )
    } else {
        return (
            <div className="container" style={{ margin: "50px auto" }}>
                <div className="row">

                    <div className="col-5 card">
                        {/* <div className='w-auto h-auto p-3'>
                                    <h5><Link onClick={chatRoomJoin}>더리치 포트폴리오 토론방 7389</Link></h5>
                                    <h6>올해는 작년보다 더 좋을듯 ' 방금 전</h6>
                                </div> */}
                        <RoomList rooms={value.state.rooms} />
                    </div>

                </div>
            </div>
        )
    }

}

export default Chatting;
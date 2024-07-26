const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const roomController = require("../Controllers/room.controller");
const app = require("../app");
const { findById } = require("../Models/chat");
const Room = require("../Models/room");

module.exports = function (io) {
    
    io.on("connection", async (socket) => {                             // 사용자가 localhost:3000 으로 접속했을때

        console.log("client is connected", socket.id);                  // 접속된 id 부여 값 확인

        socket.on("rooms", async (cb) => {                              // 리액트에서 -> node rooms(전체 방 목록 정보 조회) 요청

            const rooms = await roomController.getAllRooms();           // 모든 방 정보
            
            io.emit("rooms", await roomController.getAllRooms());       // node -> 모든 사용자 rooms 요청

            cb({                                                        // rooms 요청을 보낸 리액트 쪽으로 응답
                ok: true,
                data: rooms
            });

        });

        socket.on("joinRoom", async (rid, userName, cb) => {                    // 유저 방 참가

            try {

                let user = await userController.saveUser(userName, socket.id);  // 유저 정보 생성
                user = await userController.checkUser(user.token);              // 유저 정보 확인

                let result = await roomController.joinRoom(rid, user);          // 채팅 방 참여 

                socket.join(user.room.toString());                              // 유저가 접속한 방 프라이머리 키 채널에 조인한다.

                const welcomeMessage = {                                        // 시스템 메시지 생성
                    chat: `${user.name} 님이 입장하였습니다.`,
                    user: { id: null, name: "system", room: user.room.toString() },
                    timestamp: new Date(),
                };

                io.to(user.room.toString()).emit("message", welcomeMessage);    // 조인한 방에 시스템 메세지를 보여준다.

                io.emit("rooms", await roomController.getAllRooms());           // 다시 업데이트된 방 데이터를 클라이언트들에게 보내준다

                cb({ ok: true, data: user });                                   // joinRoom 요청을 보낸 리액트 쪽으로 응답

            } catch (error) {
                cb({ ok: false, error: error.message });
            }

        });

        socket.on("sendMessage", async (receivedMessage, userInfo, cb) => {                           // React -> node sendMessage 요청

            try {
                
                let user = await userController.saveUser(userInfo.name, socket.id);                   // 유저 정보 생성
                user = await userController.checkUser(user.token);                                    // 유저 정보 확인
                
                if (user) {                                                                           // 유저 정보가 존재할 때

                    const message = await chatController.saveChat(receivedMessage, user, user.token); // 채팅메시지 생성

                    socket.join(user.room.toString());                                                // 유저가 접속한 방 프라이머리 키 채널에 조인한다.

                    io.to(message.room.toString()).emit("message", message);                          // 조인한 방에 채팅 메세지를 보여준다.

                    return cb({ ok: true });                                                          // node서버 -> React 응답

                }

            } catch (error) {
                cb({ ok: false, error: error.message });
            }

        });

        socket.on("leaveRoom", async (userInfo, cb) => {                                              // React -> node서버 leaveRoom 요청

            try {

                const user = await userController.checkUser(userInfo.token);                          // 유저 정보 확인
                await roomController.leaveRoom(user);                                                 // 유저 방 나가기

                const leaveMessage = {                                                                // 시스템 메시지 생성
                    chat: `${user.name} left this room`,
                    user: { id: null, name: "system" },
                };

                io.emit("rooms", await roomController.getAllRooms());                                 // node -> React 모든 사용자에게 업데이트 된 방 전체 정보 목록 조회

                socket.broadcast.to(user.room.toString()).emit("message", leaveMessage);              // 접속 되어있는 방에 나를 제외한 모든 맴버에게 시스템 메세지를 보낸다

                socket.leave(user.room.toString());                                                   // join했던 방을 떠남 

                cb({ ok: true });                                                                     // node서버 -> React leaveRoom 응답

            } catch (error) {
                cb({ ok: false, message: error.message });
            }

        });

        socket.on("disconnect", async () => {                                                         // localhost:3000 사용자가 끊겼을 때(새로 고침)

            console.log("user is disconnected", socket.id);                                           // 접속되어 있던 id 부여 값 확인

            const user = await userController.checkUser(socket.id);                                   // 접속되어 있던 id로 유저 정보 확인

            if (user) {                                                                               // 유저 정보가 존재할 때

                await roomController.leaveRoom(user);                                                 // 유저 방에서 나가기

                const leaveMessage = {                                                                // 시스템 메시지 생성
                    chat: `${user.name} left this room`,
                    user: { id: null, name: "system" },
                };

                socket.broadcast.to(user.room.toString()).emit("message", leaveMessage);              // 접속 되어있는 방에 나를 제외한 모든 맴버에게 시스템 메세지를 보낸다 

                io.emit("rooms", await roomController.getAllRooms());                                 // 다시 업데이트된 방 데이터를 클라이언트들에게 보내준다

                socket.leave(user.room.toString());                                                   // join했던 방을 떠남

            }

        });
    });
} 
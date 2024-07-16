const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");
const roomController = require("../Controllers/room.controller");
const app = require("../app");
const { findById } = require("../Models/chat");
const Room = require("../Models/room");

module.exports = function (io) {
    // io ~~~~
    // localhost:3000 으로 접속했을때
    io.on("connection", async (socket) => {
        console.log("client is connected", socket.id); // 접속된 id 부여

        // 룸 리스트 보내기
        socket.on("rooms", async (cb) => {
            const rooms = await roomController.getAllRooms();
            cb({
                ok: true,
                data: rooms
            });
        });

        // 유저 방 참가
        socket.on("joinRoom", async (rid, userName, cb) => {
            try {
                // 유저 정보 이름을 중복검사 후 이름, 고유id 저장
                let user = await userController.saveUser(userName, socket.id);

                // 유저가 채팅 방 안에 있는지 확인
                user = await userController.checkUser(user.token);

                // room 데이터에 members 필드 리스트에 해당 유저가 추가된다.
                // user데이터에 room필드에도 유저가 조인한 room정보를 업데이트한다.
                let result = await roomController.joinRoom(rid, user); // 방 참여 방고유번호, user 정보

                // 유저 신규 접속
                if (result == 1) {
                    // socket은 해당 room id로 된 채널에 조인한다.
                    socket.join(user.room.toString());
                    const welcomeMessage = {
                        chat: `${user.name} 님이 입장하였습니다.`,
                        user: { id: null, name: "system", room: user.room.toString() },
                        timestamp: new Date(),
                    };

                    // 유저가 조인했다는 메세지는 방에 있는 팀원에게만 보여준다.
                    io.to(user.room.toString()).emit("message", welcomeMessage);

                    // 다시 업데이트된 room데이터를 클라이언트들에게 보내준다
                    io.emit("rooms", await roomController.getAllRooms());
                }

                cb({ ok: true, data: user });
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        // 서버 로그인
        // socket.on("login", async (userName, cb) => {
        //     // 유저정보 저장
        //     try {
        //         const user = await userController.saveUser(userName, socket.id);
        //         const welcomeMessage = {
        //             chat: `${user.name} 님이 입장하였습니다.`,
        //             user: {
        //                 id: null, name: "system"
        //             },
        //             timestamp: new Date(),
        //         };
        //         io.emit("message", welcomeMessage);
        //         cb({
        //             ok: true, data: user
        //         });
        //     } catch (error) {
        //         cb({
        //             ok: false, error: error.message
        //         });
        //     }
        // });

        // 메세지 입력 받기
        socket.on("sendMessage", async (receivedMessage, userInfo, cb) => {
            try {
                const user = await userController.checkUser(userInfo.token);

                if (user) {
                    const message = await chatController.saveChat(receivedMessage, user, user.token);

                    // socket은 해당 room id로 된 채널에 조인한다.
                    socket.join(user.room.toString());

                    // 해당 방에 메세지 전달
                    io.to(message.room.toString()).emit("message", message);
                    return cb({ ok: true });
                }
            } catch (error) {
                cb({ ok: false, error: error.message });
            }
        });

        // 방 나가기
        socket.on("leaveRoom", async (userInfo, cb) => {
            try {
                console.log(userInfo);
                const user = await userController.checkUser(userInfo.token);
                await roomController.leaveRoom(user);
                const leaveMessage = {
                    chat: `${user.name} left this room`,
                    user: { id: null, name: "system" },
                };
                socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다 
                io.emit("rooms", await roomController.getAllRooms());
                socket.leave(user.room.toString()); // join했던 방을 떠남 
                cb({ ok: true });
            } catch (error) {
                cb({ ok: false, message: error.message });
            }
        });


        // 연결 끊겼을때
        socket.on("disconnect", async () => {
            console.log("user is disconnected", socket.id);
            const user = await userController.checkUser(socket.id);
            if(user){
                await roomController.leaveRoom(user);
                const leaveMessage = {
                    chat: `${user.name} left this room`,
                    user: { id: null, name: "system" },
                };
                socket.broadcast.to(user.room.toString()).emit("message", leaveMessage); // socket.broadcast의 경우 io.to()와 달리,나를 제외한 채팅방에 모든 맴버에게 메세지를 보낸다 
                io.emit("rooms", await roomController.getAllRooms());
                socket.leave(user.room.toString()); // join했던 방을 떠남
            }
        });
    });
} 
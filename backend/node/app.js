const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
// const session = require('express-session');
const app = express();
const Room = require("./Models/room");
const userController = require("./Controllers/user.controller");

// 룸 생성 - 리액트에서 http://localhost:5001/ 요청을 보냈을 경우
app.get("/", async (req, res) => {                                          

  try {
    const roomName = req.query.roomName;                                    // 리액트에서 보내준 방제목
    const socketId = req.query.socketId;                                    // 리액트에서 보내준 socket.id

    let user = await userController.saveUser("정민기2", socketId);           // 유저 정보 이름을 중복검사 후 이름, 고유id 저장  
    user = await userController.checkUser(user.token);                      // 유저가 채팅 방 안에 있는지 확인

    // 방 생성
    const newRoom = await Room.create({

      room: roomName,                                                       // 방 제목
      members: [user._id],                                                  // 방 접속 유저들
      admin: user._id,                                                      // 방장

    });

    user.room = newRoom._id;                                                // 유저 정보에 생성한 방 id 값 저장
    await user.save();                                                      // 유저 정보 업데이트

    res.send({                                                              // 노드 -> 리액트 응답

      ok:true,
      room:newRoom,                                                         // 생성된 방 정보
      user:user,                                                            // 유저 정보

    });

  } catch (error) {
    console.log("방생성 error");
  }

});

// MongoDB 연동
mongoose.connect(process.env.DB, {                                                                            
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("connected to database"));

module.exports = app;

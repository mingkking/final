const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
// const session = require('express-session');
const app = express();
const Room = require("./Models/room");

// app.use(cors({
//   origin: 'http://localhost:3000', // 클라이언트 주소
//   credentials: true // 쿠키를 포함하여 요청을 보냄
// }));

// app.use(session({
//   secret: 'secret-key',
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24, // 24 hours
//     secure: false, // HTTPS 사용 시 true로 설정
//     httpOnly: true
//   },
// }));

// app.get('/setSession', (req, res) => {
//   // 세션에 데이터를 설정하면, 요청 받은 고유의 세션 사용자의 값만 설정됨.
//   console.log("1: ", req.query);
//   const { name } = req.query; // 쿼리에서 name 값을 가져옴
//   req.session.user = { name }; // 세션에 user 객체로 저장
//   req.session.save(err => {
//     if (err) {
//       console.error('세션 저장 오류:', err);
//       res.status(500).send('서버 오류');
//     } else {
//       console.log("2: ", req.session.user);
//       res.send(req.session.user);
//     }
//   });
// });

// app.get('/getSession', (req, res) => {
//   const user = req.session.user;
//   console.log("getSession user: ", user);
//   res.send(user);
// });

//  룸 생성
app.get("/", async (req, res) => {
  console.log("hahaha111111111");
  try {
    const roomName = req.query.roomName;
    console.log(roomName);

    Room.insertMany([
      {
        room: roomName,
        members: [],
      },
    ])
      .then(() => res.send("ok"))
      .catch((error) => res.send(error));
  } catch (error) {
    console.log("방생성 error");
  }

});

//  룸 삭제
app.get("/deleteRoom", async (req, res) => {
  console.log("ok");
});

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("connected to database"));

module.exports = app;

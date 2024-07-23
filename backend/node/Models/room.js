const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room: {                             // 방 제목
      type: String,
      unique: true,
    },
    chat: [                             // 채팅 프라이머리 키
      {
        type: mongoose.Schema.ObjectId,
        ref: "Chat",
      },
    ],
    members: [                          // 유저 프라이머리 키
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    admin: {                            // 방장(유저 프라이머리 키)
      type: mongoose.Schema.ObjectId,
      ref: "User", 
      required: true,                   // 방장을 반드시 설정해야 함
    },
  },
  { timestamps: true }                  // 생성 시간
);
module.exports = mongoose.model("Room", roomSchema);

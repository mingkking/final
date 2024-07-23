const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
    {
        chat: String,                           // 채팅 내용
        user: {                                 
            id: {                               // 유저 프라이머리 키
                type: mongoose.Schema.ObjectId,
                ref: "User",
            },
            name: String,                       // 유저 ID
        },
        room: {                                 // 방 프라이머리 키
            type: mongoose.Schema.ObjectId,
            ref: "Room",
        },
    },
    {
        timestamps: true                        // 채팅 메세지 생성 시간
    }
);

module.exports = mongoose.model("Chat", chatSchema);
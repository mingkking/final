const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    room: {
      type: String,
      unique: true,
    },
    chat: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Chat",
      },
    ],
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    // admin: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: "User", // 방장을 User 모델과 연결
    //   required: true, // 방장을 반드시 설정해야 함
    // },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Room", roomSchema);

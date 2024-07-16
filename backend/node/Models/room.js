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
  },
  { timestamps: true }
);
module.exports = mongoose.model("Room", roomSchema);

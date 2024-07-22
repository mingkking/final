const Room = require("../Models/room");
const User = require("../Models/user");
const Chat = require("../Models/chat");
const userController = require("./user.controller");
const roomController = {};

roomController.getAllRooms = async () => {                // 채팅 방 전체 목록          

  const roomList = await Room.find({});                   // 방 전체 리스트 가져오기
  return roomList;                                        // 방 전체 리스트 반환

};

// 채팅 방 참여
roomController.joinRoom = async (roomId, user) => {

  const preFindRoom = await Room.findById(user.room);     // 유저 방 입장 전 접속되어 있는 방에서 유저 삭제

  if (preFindRoom != null) {                              // 유저 방 입장 전 접속되어 있는 방이 존재할 경우

    if (preFindRoom.members.includes(user._id)) {         // 이전 방 유저가 존재할 경우

      preFindRoom.members.remove(user._id);               // 이전 방 유저 정보 삭제 
      await preFindRoom.save();                           // 이전 방 정보 DB 업데이트

    }

  }

  const room = await Room.findById(roomId);               // 현재 입장 방 번호로 방 정보를 가져온다

  if (!room.members.includes(user._id)) {                 // 현재 입장 방 안에 유저가 존재하지 않을 때

    room.members.push(user._id);                          // user._id 를 새로 추가
    await room.save();                                    // 현재 입장 방 정보 DB 업데이트

    user.room = roomId;                                   // 현재 입장 방 유저 room 속성에 roomId를 할당
    await user.save();                                    // 현재 입장 방 변경된 유저 정보 DB 업데이트

    return 1;

  } else {

    user.room = roomId;                                   // 유저의 room 속성에 roomId를 할당
    await user.save();                                    // 변경된 유저 정보를 저장

    return 0;

  }

};

// 채팅 방 나가기
roomController.leaveRoom = async (user) => {

  const room = await Room.findById(user.room);                               // 유저가 접속해 있는 방 데이터 검색

  if (room) {                                                                // 방이 존재할 때     

    if (room.admin.toString() !== user._id.toString()) {                     // 방장이 아닐 때

      room.members.remove(user._id);                                         // 접속해 있는 방에서 유저 삭제
      await room.save();                                                     // 방 데이터 저장

      await User.findByIdAndDelete(user._id).catch((error) => {              // 유저 데이터 삭제
        console.error("Error deleting user:", error);
      });

      return 0;                                                              // 방장이 아닐때의 결과 값을 받아 처리

    } else {                                                                 // 방장일 때

      for (let i = 0; i < room.chat.length; i++) {                           // 모든 채팅 수 만큼 반복

        await Chat.findByIdAndDelete(room.chat[i]).catch((error) => {        // 방 안에 채팅 데이터 삭제
          console.error("Error deleting chat:", error);
        });

      }

      for (let i = 0; i < room.members.length; i++) {                        // 방 안에 있는 멤버 수 만큼 반복

        await User.findByIdAndDelete(room.members[i]).catch((error) => {     // 방 안에 유저 데이터 삭제
          console.error("Error deleting user:", error);
        });

      }

      await Room.findByIdAndDelete(user.room).catch((error) => {             // 방장일때 방도 삭제
        console.log("Error deleting room", error);
      });

      return 1;                                                              // 방장일 때의 결과 값을 받아 처리

    }

  }

};

module.exports = roomController;
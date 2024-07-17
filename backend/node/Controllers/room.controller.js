const Room = require("../Models/room");
const User = require("../Models/user");
const roomController = {};

// 채팅 방 전체 목록
roomController.getAllRooms = async () => {
  const roomList = await Room.find({});
  return roomList;
};

// 채팅 방 참여
roomController.joinRoom = async (roomId, user) => {
  console.log("1 user.room", user.room);

  // 유저 입장 전 접속되어 있는 방에서 유저 삭제
  const preFindRoom = await Room.findById(user.room);
  if (preFindRoom != null) {
    // 이전 방의 유저 정보 삭제
    if (preFindRoom.members.includes(user._id)) {
      preFindRoom.members.remove(user._id);
      await preFindRoom.save();
    }
  }

  // 유저 방 접속 상태 초기화
  const findUser = await User.findById(user._id);
  if (findUser != null) {
    if (findUser.room != null) {
      findUser.room = null;
      await findUser.save();
    }
  }

  console.log("preFindRoom", preFindRoom);
  console.log("findUser", findUser);

  // 일치하는 방번호의 방 정보를 가져온다
  const room = await Room.findById(roomId);

  // 방 안에 user._id 가 포함되지 않을 경우
  if (!room.members.includes(user._id)) {
    // user._id 를 새로 추가
    room.members.push(user._id);

    // 후 방정보 DB 업데이트
    await room.save();

    // 유저의 room 속성에 roomId를 할당
    user.room = roomId;

    // 변경된 유저 정보를 저장
    await user.save();

    return 1;
  } else {
    // // 유저의 room 속성에 roomId를 할당
    // user.room = roomId;

    // // 변경된 유저 정보를 저장
    // await user.save();
    return 0;
  }

};

// 채팅 방 나가기
roomController.leaveRoom = async (user) => {
  const room = await Room.findById(user.room); // 유저가 접속해 있는 방 데이터 검색
  if (room) {
    room.members.remove(user._id); // 접속해 있는 방에서 유저 삭제
    await room.save(); // 방 데이터 저장

    // 유저 데이터 삭제
    User.findByIdAndDelete(user._id).catch((error) => {
      console.error("Error deleting user:", error);
    });
  }
};

module.exports = roomController;
const Room = require("../Models/room");
const roomController = {};

// 채팅 방 전체 목록
roomController.getAllRooms = async () => {
  const roomList = await Room.find({});
  return roomList;
};

// 채팅 방 참여
roomController.joinRoom = async (roomId, user) => {
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
    // 유저의 room 속성에 roomId를 할당
    user.room = roomId;

    // 변경된 유저 정보를 저장
    await user.save();
    return 0;
  }

};

// 채팅 방 나가기
roomController.leaveRoom = async (user) => {
    const room = await Room.findById(user.room);
    if (!room) {
      throw new Error("Room not found");
    }
    room.members.remove(user._id);
    await room.save();

};

module.exports = roomController;
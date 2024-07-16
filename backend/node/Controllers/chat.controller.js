const { timeStamp } = require("console");
const Chat = require("../Models/chat");
const Room = require("../Models/room");
const chatController = {

}

// 채팅 메세지 내용, 유저정보 저장
chatController.saveChat = async(message, user, sid) => {
    // Chat 데이터 객체 생성
    const newMessage = new Chat({
        // 채팅 내용
        chat: message, 

        // 유저 정보
        user: {
            // id: user._id, // 유저 프라이머리 키
            id: user._id,
            name: user.name, // 유저 ID
        },
        room: user.room, // 유저가 접속해 있는 방 번호
        timestamp: new Date() // 채팅 입력한 시간
    });

    // 해당 방 번호에 대한 방 DB 값 검색
    const room = await Room.findById(user.room.toString());

    // 해당 방에 chat 프라이머리 키 삽입
    room.chat.push(newMessage._id);

    // 해당 방 DB 값 저장
    await room.save();

    await newMessage.save(); // chatsDB 에 위의 내용 저장
    return newMessage; // 위의 내용 반환
}

module.exports=chatController;

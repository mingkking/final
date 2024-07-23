const { timeStamp } = require("console");
const Chat = require("../Models/chat");                    // 채팅 스키마
const Room = require("../Models/room");                    // 방 스키마

const chatController = { }                                 // 채팅 컨트롤러

chatController.saveChat = async(message, user, sid) => {   // 채팅 메세지 내용, 유저정보 저장
    
    const newMessage = new Chat({                          // Chat 데이터 객체 생성
        
        chat: message,                                     // 채팅 내용

        user: {                                            // 유저 정보
            
            id: user._id,                                  // 유저 프라이머리 키
            name: user.name,                               // 유저 ID

        },
        room: user.room,                                   // 유저가 접속해 있는 방 번호
        timestamp: new Date()                              // 채팅 입력한 시간

    });

    const room = await Room.findById(user.room.toString()); // 해당 방 번호에 대한 방 DB 값 검색

    room.chat.push(newMessage._id);                         // 해당 방에 chat 프라이머리 키 삽입

    await room.save();                                      // 해당 방 DB 값 저장
    await newMessage.save();                                // chatDB 에 위의 내용 저장

    return newMessage;                                      // 위의 내용 반환
}

module.exports=chatController;

import { createContext, useState } from "react";
const RoomListContext = createContext();
// 생성자
const RoomListProvider = (props) => {

	const [rId, setRId] = useState(null); 					   // 채팅방 PK 정보 저장
	const [user, setUser] = useState(null); 				   // 유저 정보 저장
	const [rooms, setRooms] = useState([]); 				   // 채팅 방 정보 저장
	const [messageList, setMessageList] = useState([]); 	   // 전체 메세지 저장
	const [chatUserNick, setChatUserNick] = useState(null);    // 채팅 유저 닉네임

	const values = {
		state: { user, rId, rooms, messageList, chatUserNick },
		actions: { setUser, setRId, setRooms, setMessageList, setChatUserNick } 
	}

	return (
		<RoomListContext.Provider value={values}>
			{props.children}
		</RoomListContext.Provider>
	);
}

export { RoomListProvider };
export default RoomListContext;
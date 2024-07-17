import { createContext, useState } from "react";
		const RoomListContext = createContext();
		// 생성자
		const RoomListProvider = (props) => {
            // 채팅방 정보 저장
            const [rId, setRId] = useState(null);

		    // 유저 정보 저장
            const [user, setUser] = useState(null);

			 // 채팅 방 리스트
			 const [rooms, setRooms] = useState([]);

			 // 전체 메세지 저장
			 const [messageList, setMessageList] = useState([]);
		
		    const values = {
		        state : { user, rId , rooms, messageList },
		        actions : { setUser, setRId , setRooms, setMessageList }
		    }
		
		    return (
		        <RoomListContext.Provider value={values}>
		            {props.children}
		        </RoomListContext.Provider>
		    );
		}
		
		export {RoomListProvider};
		export default RoomListContext;
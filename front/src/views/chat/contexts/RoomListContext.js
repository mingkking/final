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
		
		    const values = {
		        state : { user, rId , rooms },
		        actions : { setUser, setRId , setRooms }
		    }
		
		    return (
		        <RoomListContext.Provider value={values}>
		            {props.children}
		        </RoomListContext.Provider>
		    );
		}
		
		export {RoomListProvider};
		export default RoomListContext;
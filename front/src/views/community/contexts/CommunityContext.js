import { createContext, useState } from "react";
const CommunityContext = createContext();
// 생성자
const CommunityProvider = (props) => {
	const [realTime, setRealTime] = useState(null);
	const [chatUserNick, setChatUserNick] = useState(null);

	const values = {
		state: { realTime, chatUserNick },
		actions: { setRealTime, setChatUserNick } 
	}

	return (
		<CommunityContext.Provider value={values}>
			{props.children}
		</CommunityContext.Provider>
	);
}

export { CommunityProvider };
export default CommunityContext;
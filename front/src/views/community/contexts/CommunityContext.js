import { createContext, useState } from "react";
const CommunityContext = createContext();
// 생성자
const CommunityProvider = (props) => {
	const [realTime, setRealTime] = useState(null);
	const [UserNick, setUserNick] = useState(null);
	const [userNum, setUserNum] = useState(null);
	const [selectAllPosts, setSelectAllPosts] = useState([]);
	const [selectOnePost, setSelectOnePost] = useState(null);

	const values = {
		state: { realTime, UserNick, userNum, selectAllPosts, selectOnePost },
		actions: { setRealTime, setUserNick, setUserNum, setSelectAllPosts, setSelectOnePost } 
	}

	return (
		<CommunityContext.Provider value={values}>
			{props.children}
		</CommunityContext.Provider>
	);
}

export { CommunityProvider };
export default CommunityContext;
import { createContext, useState } from "react";
const CommunityContext = createContext();
// 생성자
const CommunityProvider = (props) => {
	const [realTime, setRealTime] = useState(null);
	const [userNick, setUserNick] = useState(null);
	const [userNum, setUserNum] = useState(null);
	const [selectAllPosts, setSelectAllPosts] = useState([]);
	const [selectAllUserLike, setSelectAllUserLike] = useState([]);
	const [selectOnePost, setSelectOnePost] = useState(null); 
	const [selectAllPopularPosts, setSelectAllPopularPosts] = useState(null);
	const [selectAllBookmark, setSelectAllBookmark] = useState([]);

	const values = {
		state: { realTime, userNick, userNum, selectAllPosts, selectAllUserLike, selectOnePost, selectAllPopularPosts, selectAllBookmark },
		actions: { setRealTime, setUserNick, setUserNum, setSelectAllPosts, setSelectAllUserLike, setSelectOnePost, setSelectAllPopularPosts, setSelectAllBookmark } 
	}

	return (
		<CommunityContext.Provider value={values}>
			{props.children}
		</CommunityContext.Provider>
	);
}

export { CommunityProvider };
export default CommunityContext;
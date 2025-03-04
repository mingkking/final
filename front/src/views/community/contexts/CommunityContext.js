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
	const [selectAllReply, setSelectAllReply] = useState([]);
	const [selectAllReReply, setSelectAllReReply] = useState([]);
	const [ id, setId ] = useState([]);
	const [selectAllDeclaration, setSelectAllDeclaration] = useState([]);
	const [selectAllUserLikeCnt, setSelectAllUserLikeCnt] = useState({});
	const [selectAllReplyCnt, setSelectAllReplyCnt] = useState({});

	const values = {
		state: { realTime, userNick, userNum, selectAllPosts, selectAllUserLike, selectOnePost, selectAllPopularPosts, selectAllBookmark, selectAllReply, selectAllReReply, id, selectAllDeclaration, selectAllUserLikeCnt, selectAllReplyCnt },
		actions: { setRealTime, setUserNick, setUserNum, setSelectAllPosts, setSelectAllUserLike, setSelectOnePost, setSelectAllPopularPosts, setSelectAllBookmark, setSelectAllReply, setSelectAllReReply, setId, setSelectAllDeclaration, setSelectAllUserLikeCnt, setSelectAllReplyCnt } 
	}

	return (
		<CommunityContext.Provider value={values}>
			{props.children}
		</CommunityContext.Provider>
	);
}

export { CommunityProvider };
export default CommunityContext;
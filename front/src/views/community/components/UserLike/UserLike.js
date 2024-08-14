import axios from "axios";
import { useContext, useEffect, useState } from "react";
import CommunityContext from "../../contexts/CommunityContext";
import { useNavigate } from "react-router";
import { Tooltip } from '@mui/material';

const UserLike = (props) => {
    const communityValue = useContext(CommunityContext);
    const navigate = useNavigate();
    const [isLike, setIsLike] = useState(false);
    const userLikeList = communityValue.state.selectAllUserLike || [];
    const userLikeCntList = communityValue.state.selectAllUserLikeCnt || [];

    useEffect(() => {
        let liked = false;

        if (userLikeList.length > 0) {

            userLikeList.map((userLike, i) => {
                if (userLike.id.id === props.postId && userLike.user_num.userNum === communityValue.state.userNum) {
                    liked = true;
                }
            });

        }
        setIsLike(liked);
    }, [communityValue.state.selectAllUserLike, props.postId, communityValue.state.userNum]);


    const likeBtn = () => {
        setIsLike(!isLike);
        likePro();
    }

    const likePro = async () => {
        const userLike = {
            user_num: { userNum: communityValue.state.userNum },
            id: { id: props.postId },
        }

        if (!isLike) {
            axios.post("http://localhost:8080/insertUserLike", userLike) // 데이터 -> 컨트롤러 요청
                .then(() => {
                    axios.get("http://localhost:8080/selectAllUserLikeCnt")             // 검색 -> 컨트롤러 요청

                        .then((res) => {                                                // DB 검색 요청 후 응답     
                            communityValue.actions.setSelectAllUserLikeCnt(res.data);   // 커뮤니티 모든 글 좋아요 수 검색 데이터 저장
                        })
                })
        } else {
            axios.post("http://localhost:8080/deleteUserLike", userLike) // 데이터 -> 컨트롤러 요청
                .then(() => {
                    axios.get("http://localhost:8080/selectAllUserLikeCnt")             // 검색 -> 컨트롤러 요청

                        .then((res) => {                                                // DB 검색 요청 후 응답     
                            communityValue.actions.setSelectAllUserLikeCnt(res.data);   // 커뮤니티 모든 글 좋아요 수 검색 데이터 저장
                        })
                })
        }
    }

    return (
        <div>
            <Tooltip title={isLike ? "좋아요 해제" : "좋아요"}>
                {isLike ?
                    <button className='community-insertBtn' onClick={likeBtn}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="currentColor"
                            className="bi bi-heart"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
                    :
                    <button className='community-insertBtn' onClick={likeBtn}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="bi bi-heart"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    </button>
                }
            </Tooltip>
            {userLikeCntList.length > 0 &&
                userLikeCntList.map((userLikeCnt, i) => {
                    if (userLikeCnt.ID === props.postId) {
                        return (
                            userLikeCnt.CNT
                        )
                    }
                })}
        </div>
    );
}

export default UserLike;
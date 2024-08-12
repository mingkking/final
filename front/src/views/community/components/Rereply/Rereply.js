import { useContext, useState, useEffect } from "react";
import "./Rereply.css";
import CommunityContext from "../../contexts/CommunityContext";
import LoginContext from "../../../login/contexts/LoginContext";
import { Tooltip } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const Rereply = (props) => {
    const communityValue = useContext(CommunityContext);
    const loginValue = useContext(LoginContext);
    const [isCreateRereplyBtn, setIsCreateRereplyBtn] = useState(false);
    const [rereplyContent, setRereplyContent] = useState("");
    const [rereplyContentCheck, setRereplyContentCheck] = useState(null);
    const reReplyList = communityValue.state.selectAllReReply || [];

    const [isUpdateReReplyBtn, setIsUpdateReReplyBtn] = useState(false);
    const [reReplyUpdateContent, setReReplyUpdateContent] = useState("");
    const [reReplyUpdateContentCheck, setReReplyUpdateContentCheck] = useState(null);

    const handleRereplyInputText = (e) => {
        setRereplyContent(e.target.value);
    }

    const handleRereplyInputClick = (replyId) => {
        setIsCreateRereplyBtn(replyId);
    }

    const handleRereplyCancelClick = () => {
        setIsCreateRereplyBtn(false);
        setRereplyContent("");
        setRereplyContentCheck(null);
    }

    const handleRereplyOnSubmit = async (e) => {
        e.preventDefault();
        if (!rereplyContent.trim()) {
            setRereplyContentCheck("답글 내용을 입력해주세요.");
            return;
        }

        setRereplyContentCheck(null);

        console.log("reply_num", props.reply_num);
        console.log("user_num", communityValue.state.userNum);
        console.log("content", rereplyContent);
        console.log("selectAllReReply", communityValue.state.selectAllReReply);

        const formData = new FormData();
        formData.append("reply_num", props.reply_num); // 커뮤니티 프라이머리 키
        formData.append("user_num", communityValue.state.userNum); // 유저 프라이머리 키
        formData.append("content", rereplyContent); // 답글 내용

        await axios.post("http://localhost:8080/insertReReply", formData) // 데이터 -> 컨트롤러 요청
            .then((res) => {
                setTimeout(() => {
                    setRereplyContent("");                                    // 댓글 내용 초기화
                    handleRereplyCancelClick(); // 대댓글 작성 후 입력창 닫기
                    axios.get("http://localhost:8080/selectAllReReply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청

                        .then((res) => {                                                // DB 입력 요청 후 응답
                            communityValue.actions.setSelectAllReReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
                        })
                }, 0);
            })
    }

    const createAtCal = (created_at) => {
        const now = new Date();
        const date = new Date(created_at);

        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) {
            return `${diffInSeconds}초 전`;
        }

        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`;
        }

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        }

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) {
            return `${diffInDays}일 전`;
        }

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) {
            return `${diffInWeeks}개월 전`;
        }

    }

    const [userProfiles, setUserProfiles] = useState({}); // 사용자 프로필 저장

    const fetchUserProfiles = async () => {
        try {
            const users = reReplyList.map(reReply => reReply.user_num.userId);

            const response = await Promise.all(users.map(userId => axios.get(`http://localhost:8080/api/profile-image/${userId}`)));

            const profiles = response.reduce((acc, { data }) => {
                if (data.userId) {
                    acc[data.userId] = data.profileImageUrl;
                } else {
                    console.warn('No userId found in response data:', data);
                }
                return acc;
            }, {});

            setUserProfiles(profiles);
        } catch (error) {
            console.error('사용자 프로필 조회 오류:', error);
        }
    };

    useEffect(() => {
        if (reReplyList.length) {
            fetchUserProfiles();
        }
    }, [reReplyList]);

    const handleReReplyUpdateClick = (rereply_num) => {
        setIsUpdateReReplyBtn(rereply_num);
    }

    const handleOnReReplyUpdateSubmit = async (rereply_num) => {
        if (!reReplyUpdateContent.trim()) {
            setReReplyUpdateContentCheck("수정 내용을 입력해주세요.");
            return;
        }

        setReReplyUpdateContentCheck(null);

        const formData = new FormData();
        formData.append("rereply_num", rereply_num); // 커뮤니티 대댓글 프라이머리 키
        formData.append("reply_num", props.reply_num); // 커뮤니티 댓글 프라이머리 키
        formData.append("user_num", communityValue.state.userNum); // 유저 프라이머리 키
        formData.append("content", reReplyUpdateContent); // 답글 내용

        await axios.post("http://localhost:8080/updateReReply", formData) // 데이터 -> 컨트롤러 요청
            .then((res) => {
                setReReplyUpdateContent("");                                    // 댓글 내용 초기화
                handleReReplyUpdateClick(); // 대댓글 작성 후 입력창 닫기
                axios.get("http://localhost:8080/selectAllReReply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청
                    .then((res) => {                                                // DB 입력 요청 후 응답
                        communityValue.actions.setSelectAllReReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
                    })
            })
    }

    const handleReReplyDeleteClick = async (rereply_num) => {
        const check = window.confirm("삭제하시겠습니까?");
        if (!check) {
            return;
        }
        await axios.delete(`http://localhost:8080/deleteReReply/${rereply_num}`) // 데이터 -> 컨트롤러 요청
            .then((res) => {
                axios.get("http://localhost:8080/selectAllReReply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청
                    .then((res) => {                                                // DB 입력 요청 후 응답
                        communityValue.actions.setSelectAllReReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
                    })
            })
    }

    return (
        <>
            <button className="reply-item-rereplyBtn" onClick={() => handleRereplyInputClick(props.reply_num)}>
                답글 달기
            </button>

            <div className="rereply-container">
                <ul className="rereply-list">
                    {isCreateRereplyBtn === props.reply_num && (
                        <form method="post">
                            <li className="rereply-item">
                                <input
                                    className="form-control rereply-input"
                                    type="text"
                                    placeholder="답글을 남겨주세요."
                                    autoFocus
                                    onChange={handleRereplyInputText}
                                    value={rereplyContent}
                                />
                                {rereplyContentCheck && <div className="rereply-check">{rereplyContentCheck}</div>}
                                <div className="rereply-btn">
                                    <Tooltip title="답글 작성">
                                        <button className="community-insertBtn" onClick={handleRereplyOnSubmit}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="42"
                                                height="42"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="feather feather-edit"
                                            >
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                        </button>
                                    </Tooltip>
                                    <Tooltip title="취소">
                                        <button className="community-insertBtn" onClick={handleRereplyCancelClick}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="feather feather-x"
                                            >
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </button>
                                    </Tooltip>
                                </div>
                            </li>
                        </form>
                    )}
                    {
                        reReplyList.map((reReply, i) => {
                            if (reReply.reply_num.reply_num === props.reply_num) {
                                return (
                                    <div key={i}>
                                        <li className="rereply-item">
                                            <div className="rereply-item-top">
                                                <Link className="no-underline-link" to={`/MemberPage?id=${reReply.user_num.userId}`} state={{ id: reReply.user_num.userId }}>
                                                    <div className='rereply-item-profile'>
                                                        <img src={userProfiles[reReply.user_num.userId] ?
                                                            (userProfiles[reReply.user_num.userId].startsWith('http') ?
                                                                userProfiles[reReply.user_num.userId] :
                                                                `http://localhost:8080${userProfiles[reReply.user_num.userId]}`)
                                                            :
                                                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                                            className="profile-image"
                                                            alt="프로필"
                                                            onError={(e) => {
                                                                // 이미지 로드 실패 시 기본 이미지로 대체
                                                                e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                                                            }} />

                                                    </div>
                                                </Link>
                                                <div className='rereply-item-info'>

                                                    <div className='rereply-item-userNickname'>
                                                        <Link className="no-underline-link" to={`/MemberPage?id=${reReply.user_num.userId}`} state={{ id: reReply.user_num.userId }}>
                                                            {reReply.user_num.userNickname}
                                                        </Link>
                                                        {reReply.user_num.userNum === communityValue.state.userNum ? (
                                                            <Tooltip title="나의 대댓글 수정 삭제">
                                                                <button className='rereply-item-menu community-insertBtn' onClick={() => {
                                                                    handleReReplyUpdateClick(reReply.rereply_num);
                                                                }}>
                                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle cx="6" cy="12" r="2" fill="currentColor" />
                                                                        <circle cx="12" cy="12" r="2" fill="currentColor" />
                                                                        <circle cx="18" cy="12" r="2" fill="currentColor" />
                                                                    </svg>
                                                                </button>
                                                            </Tooltip>
                                                        ) : null}
                                                    </div>
                                                    {isUpdateReReplyBtn === reReply.rereply_num && (
                                                        <form method="post">
                                                            <li className="rereply-item">
                                                                <input
                                                                    className="form-control rereply-input"
                                                                    type="text"
                                                                    placeholder="대댓글 수정"
                                                                    autoFocus
                                                                    value={reReplyUpdateContent}
                                                                    onChange={(e) => {
                                                                        setReReplyUpdateContent(e.target.value);
                                                                    }}
                                                                />
                                                                {reReplyUpdateContentCheck && <div className="rereply-check">{reReplyUpdateContentCheck}</div>}
                                                                <div className="rereply-btn">
                                                                    <Tooltip title="수정 완료">
                                                                        <button className="community-insertBtn"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                handleOnReReplyUpdateSubmit(reReply.rereply_num);
                                                                            }}>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="42"
                                                                                height="42"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                className="feather feather-edit"
                                                                            >
                                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                                                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                                            </svg>
                                                                        </button>
                                                                    </Tooltip>
                                                                    <Tooltip title="취소">
                                                                        <button className="community-insertBtn" onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setIsUpdateReReplyBtn(false);
                                                                            setReReplyUpdateContent("");
                                                                            setReReplyUpdateContentCheck("");
                                                                        }}>
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                width="24"
                                                                                height="24"
                                                                                viewBox="0 0 24 24"
                                                                                fill="none"
                                                                                stroke="currentColor"
                                                                                strokeWidth="2"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                className="feather feather-x"
                                                                            >
                                                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                                                            </svg>
                                                                        </button>
                                                                    </Tooltip>
                                                                    <Tooltip title="대댓글 삭제">
                                                                        <button className="community-insertBtn" onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleReReplyDeleteClick(reReply.rereply_num);
                                                                        }}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-trash-simple">
                                                                                <path d="M3 6h18" />
                                                                                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                                                <path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
                                                                                <path d="M9 11v6" />
                                                                                <path d="M15 11v6" />
                                                                            </svg>
                                                                        </button>
                                                                    </Tooltip>
                                                                </div>
                                                            </li>
                                                        </form>
                                                    )}

                                                    <div className='rereply-item-content'>{reReply.content}</div>

                                                    <div className='rereply-item-created_at'>
                                                        {createAtCal(reReply.created_at)}
                                                    </div>
                                                </div>

                                            </div>
                                        </li>
                                    </div>
                                )
                            }
                        })
                    }
                </ul>
            </div>

        </>
    );
}

export default Rereply;

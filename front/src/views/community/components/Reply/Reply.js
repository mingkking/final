import { useContext, useState, useEffect } from "react";
import "./Reply.css"
import CommunityContext from "../../contexts/CommunityContext";
import axios from "axios";
import LoginContext from "../../../login/contexts/LoginContext";
import { Await, Link } from "react-router-dom";
import { Tooltip } from '@mui/material';
import Rereply from "../Rereply/Rereply";
import ReactModal from "react-modal";
import Declaration from "../Declaration/Declaration";

const Reply = () => {
    const communityValue = useContext(CommunityContext);
    const loginValue = useContext(LoginContext);
    const [isCreateReplyBtn, setIsCreateReplyBtn] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyContentCheck, setReplyContentCheck] = useState(null);
    const replyList = communityValue.state.selectAllReply || [];

    const [isUpdateReplyBtn, setIsUpdateReplyBtn] = useState(false);
    const [replyUpdateContent, setReplyUpdateContent] = useState("");
    const [replyUpdateContentCheck, setReplyUpdateContentCheck] = useState(null);

    const handleReplyInputClick = () => {
        setIsCreateReplyBtn(true);
    }

    const handleReplyCancelClick = () => {
        setIsCreateReplyBtn(false);
        setReplyContent("");
        setReplyContentCheck(null);
    }

    const handleReplyInputText = (e) => {
        setReplyContent(e.target.value);
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (replyContent === null || replyContent === "") {             // 커뮤니티 내용 필드가 비어있을 경우

            setReplyContentCheck("게시글 댓글 내용을 입력해주세요.");
            return;

        } else {
            setReplyContentCheck(null);
        }

        const formData = new FormData();                                // 폼 데이터 가공
        formData.append("id", communityValue.state.selectOnePost.id);   // 커뮤니티 프라이머리 키
        formData.append('user_num', communityValue.state.userNum);      // 유저 프라이머리 키 
        formData.append('contents', replyContent);                       // 커뮤니티 댓글 내용

        await axios.post("http://localhost:8080/insertReply", formData) // 데이터 -> 컨트롤러 요청
            .then((res) => {
                setReplyContent("");                                    // 댓글 내용 초기화
                handleReplyCancelClick(); // 댓글 작성 후 버튼 닫기
            })
        await axios.get("http://localhost:8080/selectAllReply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 입력 요청 후 응답
                communityValue.actions.setSelectAllReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
            })
        await axios.get("http://localhost:8080/selectAllReplyCnt")            // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 검색 요청 후 응답
                communityValue.actions.setSelectAllReplyCnt(res.data);         // 커뮤니티 모든 글 댓글 수 검색 데이터 저장
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

    const [userProfiles, setUserProfiles] = useState(""); // 프로필 이미지 상태 추가

    const fetchUserProfiles = async () => {
        try {
            const users = replyList.map(reply => reply.user_num.userId);

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
        if (replyList.length) {
            fetchUserProfiles();
        }
    }, [replyList]);

    const handleReplyUpdateClick = (reply_num) => {
        setIsUpdateReplyBtn(reply_num);
    }

    const handleOnUpdateSubmit = async (reply_num) => {
        console.log(reply_num);
        if (replyUpdateContent === null || replyUpdateContent === "") {             // 커뮤니티 내용 필드가 비어있을 경우

            setReplyUpdateContentCheck("수정 내용을 입력해주세요.");
            return;

        } else {
            setReplyUpdateContentCheck(null);
        }

        const formData = new FormData();                                // 폼 데이터 가공
        formData.append("reply_num", reply_num);                        // 댓글 프라이머리 키
        formData.append("id", communityValue.state.selectOnePost.id);   // 커뮤니티 프라이머리 키
        formData.append('user_num', communityValue.state.userNum);      // 유저 프라이머리 키 
        formData.append('contents', replyUpdateContent);                 // 커뮤니티 댓글 내용

        await axios.post("http://localhost:8080/updateReply", formData) // 데이터 -> 컨트롤러 요청
            .then((res) => {
                setReplyUpdateContent("");                                    // 댓글 내용 초기화
                handleReplyUpdateClick(); // 댓글 작성 후 버튼 닫기
            })
        await axios.get("http://localhost:8080/selectAllReply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 입력 요청 후 응답
                communityValue.actions.setSelectAllReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
            })

    }

    const handleReplyDeleteClick = async (reply_num) => {
        const check = window.confirm("삭제하시겠습니까?");
        if (!check) {
            return;
        }
        await axios.delete(`http://localhost:8080/deleteReply/${reply_num}`) // 데이터 -> 컨트롤러 요청
        await axios.get("http://localhost:8080/selectAllReply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청
            .then((res) => {                                                // DB 입력 요청 후 응답
                communityValue.actions.setSelectAllReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
            })
        await axios.get("http://localhost:8080/selectAllReplyCnt")            // 검색 -> 컨트롤러 요청
            .then((res) => {                                                // DB 검색 요청 후 응답
                communityValue.actions.setSelectAllReplyCnt(res.data);         // 커뮤니티 모든 글 댓글 수 검색 데이터 저장
            })
    }



    return (
        <div className='reply-container'>
            <ul className="reply-list">
                <form method="post">
                    <li className="reply-item">
                        <input className='form-control reply-input' type='text' name='' placeholder='댓글' onClick={handleReplyInputClick} onChange={handleReplyInputText} value={replyContent} />
                        {replyContentCheck && <div className='rereply-check'>{replyContentCheck}</div>}
                        {isCreateReplyBtn && (<div className="reply-btn">
                            <Tooltip title={"댓글 작성"}>
                                <button className='community-insertBtn' onClick={handleOnSubmit}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                    </svg>
                                </button>
                            </Tooltip>
                            <Tooltip title={"취소"}>
                                <button className='community-insertBtn' onClick={handleReplyCancelClick}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </Tooltip>
                        </div>)}
                    </li>
                </form>
                {replyList.length > 0 &&
                    replyList.map((reply, i) => {
                        return (
                            <div key={i}>
                                <li className="reply-item">
                                    <div className="reply-item-top">
                                        <Link className="no-underline-link" to={`/MemberPage?id=${reply.user_num.userId}`} state={{ id: reply.user_num.userId }}>
                                            <div className='reply-item-profile'>
                                                <img
                                                    src={userProfiles[reply.user_num.userId] ?
                                                        (userProfiles[reply.user_num.userId].startsWith('http') ?
                                                            userProfiles[reply.user_num.userId] :
                                                            `http://localhost:8080${userProfiles[reply.user_num.userId]}`)
                                                        :
                                                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                                    className="profile-image"
                                                    alt=""
                                                    onError={(e) => {
                                                        // 이미지 로드 실패 시 기본 이미지로 대체
                                                        e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                                                    }} />
                                            </div>
                                        </Link>
                                        <div className='reply-item-info'>

                                            <div className='reply-item-userNickname'>
                                                <Link className="no-underline-link" to={`/MemberPage?id=${reply.user_num.userId}`} state={{ id: reply.user_num.userId }}>
                                                    {reply.user_num.userNickname}
                                                </Link>
                                                {reply.user_num.userNum === communityValue.state.userNum ?
                                                    (
                                                        <Tooltip title="댓글">
                                                            <button className='reply-item-menu community-insertBtn' onClick={() => {
                                                                handleReplyUpdateClick(reply.reply_num);
                                                            }}>
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="6" cy="12" r="2" fill="currentColor" />
                                                                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                                                                    <circle cx="18" cy="12" r="2" fill="currentColor" />
                                                                </svg>
                                                            </button>
                                                        </Tooltip>
                                                    ) : (
                                                        <Declaration type={"reply"} type_num={reply.reply_num} />
                                                    )}
                                            </div>


                                            {isUpdateReplyBtn === reply.reply_num && (
                                                <form method="post">
                                                    <li className="rereply-item">
                                                        <input
                                                            className="form-control rereply-input"
                                                            type="text"
                                                            placeholder="댓글 수정"
                                                            autoFocus
                                                            value={replyUpdateContent}
                                                            onChange={(e) => {
                                                                setReplyUpdateContent(e.target.value);
                                                            }}
                                                        />
                                                        {replyUpdateContentCheck && <div className="rereply-check">{replyUpdateContentCheck}</div>}
                                                        <div className="rereply-btn">
                                                            <Tooltip title="수정 완료">
                                                                <button className="community-insertBtn"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleOnUpdateSubmit(reply.reply_num);
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
                                                                    setIsUpdateReplyBtn(false);
                                                                    setReplyUpdateContentCheck("");
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
                                                            <Tooltip title="댓글 삭제">
                                                                <button className="community-insertBtn" onClick={(e) => {
                                                                    e.preventDefault();
                                                                    handleReplyDeleteClick(reply.reply_num);
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
                                            <div className='reply-item-content'>{reply.contents}</div>

                                            <div className='reply-item-created_at'>
                                                {createAtCal(reply.created_at)}
                                                <Rereply reply_num={reply.reply_num} />
                                            </div>
                                        </div>

                                    </div>
                                </li>
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    );
}

export default Reply;
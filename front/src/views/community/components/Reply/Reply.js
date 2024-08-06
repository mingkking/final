import { useContext, useState } from "react";
import "./Reply.css"
import CommunityContext from "../../contexts/CommunityContext";
import axios from "axios";
import LoginContext from "../../../login/contexts/LoginContext";

const Reply = () => {
    const communityValue = useContext(CommunityContext);
    const loginValue = useContext(LoginContext);
    const [isCreateReplyBtn, setIsCreateReplyBtn] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [replyContentCheck, setReplyContentCheck] = useState(null);
    const replyList = communityValue.state.selectAllReply || [];

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
    console.log(communityValue.state.selectAllReply);
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
        formData.append('content', replyContent);                       // 커뮤니티 댓글 내용

        await axios.post("http://localhost:8080/insertReply", formData) // 데이터 -> 컨트롤러 요청
            .then((res) => {
                // setTimeout(() => {
                //     axios.get("http://localhost:8080/selectAllReply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청

                //         .then((res) => {                                                // DB 입력 요청 후 응답
                //             communityValue.actions.setSelectAllReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
                //         })
                // }, 1000);
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

    return (
        <div className='reply-container'>
            <ul className="reply-list">
                <form method="post">
                    <li className="reply-item">
                        <input className='form-control reply-input' type='text' name='' placeholder='게시글에 댓글을 남겨주세요.' onClick={handleReplyInputClick} onChange={handleReplyInputText} value={replyContent} />
                        {replyContentCheck && <div className='reply-check'>{replyContentCheck}</div>}
                        {isCreateReplyBtn && (<div className="reply-btn">
                            <button className='community-insertBtn' onClick={handleOnSubmit}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                            <button className='community-insertBtn' onClick={handleReplyCancelClick}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>)}
                    </li>
                </form>
                {replyList.map((reply, i) => {
                    return (
                        <div>
                            <li className="reply-item">
                                <div className="reply-item-top">
                                    <div className='reply-item-profile'><img src={loginValue.state.profileImage} className="profile-image"></img></div>
                                    <div className='reply-item-info'>
                                        <div className='reply-item-userNickname'>{reply.user_num.userNickname}</div>
                                        <div className='reply-item-content'>{reply.content}</div>
                                        <div className='reply-item-created_at'>{createAtCal(reply.created_at)}</div>
                                    </div>
                                </div>
                            </li>
                        </div>
                    )
                })}

            </ul>
        </div>
    );
}

export default Reply;
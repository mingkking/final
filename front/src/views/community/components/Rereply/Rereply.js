import { useContext, useState } from "react";
import "./Rereply.css";
import CommunityContext from "../../contexts/CommunityContext";
import LoginContext from "../../../login/contexts/LoginContext";
import { Tooltip } from "@mui/material";
import axios from "axios";

const Rereply = (props) => {
    const communityValue = useContext(CommunityContext);
    const loginValue = useContext(LoginContext);
    const [isCreateRereplyBtn, setIsCreateRereplyBtn] = useState(false);
    const [rereplyContent, setRereplyContent] = useState("");
    const [rereplyContentCheck, setRereplyContentCheck] = useState(null);
    const reReplyList = communityValue.state.selectAllReReply || [];

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
                // setTimeout(() => {
                setRereplyContent("");                                    // 댓글 내용 초기화
                // axios.get("http://localhost:8080/selectAllRereply", { params: { id: communityValue.state.selectOnePost.id } })            // 검색 -> 컨트롤러 요청

                //     .then((res) => {                                                // DB 입력 요청 후 응답
                //         communityValue.actions.setSelectAllRereply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
                //     })
                // }, 1000);
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
                                    onChange={handleRereplyInputText}
                                    value={rereplyContent}
                                />
                                {rereplyContentCheck && <div className="rereply-check">{rereplyContentCheck}</div>}
                                <div className="rereply-btn">
                                    <Tooltip title="댓글 작성">
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
                                    <li key={reReply.rereply_num}>
                                        111111111111
                                    </li>
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

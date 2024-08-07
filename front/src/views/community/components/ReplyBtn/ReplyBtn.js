import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router";

const ReplyBtn = (props) => {
    const navigate = useNavigate();

    const handleReplyBtnClick = () => {
        if(props.off !== 1){
            navigate("/DetailCommunity", { state: { id: props.postId, click: 1 } });
        }
    }

    return (
        <div className='post-item-replyBtn' onClick={handleReplyBtnClick}>
            <Tooltip title={"댓글 보러가기"}>
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
                    className="bi bi-chat"
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10z" />
                </svg>
            </Tooltip>
        </div>
    );
}

export default ReplyBtn;
import { useNavigate } from "react-router";

const ReplyBtn = (props) => {
    const navigate = useNavigate();

    const handleReplyBtnClick = () => {
        console.log(props.postId);
        navigate("/DetailCommunity", {state: {id: props.postId, click: 1} });
    }

    return (
        <div className='post-item-replyBtn' onClick={handleReplyBtnClick}>
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
        </div>
    );
}

export default ReplyBtn;
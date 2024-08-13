import { useContext, useEffect, useState } from "react";
import CommunityContext from "../../contexts/CommunityContext";
import LoginContext from "../../../login/contexts/LoginContext";
import axios from "axios";
import { Tooltip } from "@mui/material";
import ReactModal from "react-modal";

const Declaration = (props) => {
    const communityValue = useContext(CommunityContext);
    const loginValue = useContext(LoginContext);
    const [isDeclaration, setIsDeclaration] = useState(false);
    const [isDeclarationModalOpen, setIsDeclarationModalOpen] = useState(false);
    const [isDeclarationContent, setIsDeclarationContent] = useState(false);
    const [declarationContent, setDeclarationContent] = useState("");
    const [declarationContentCheck, setDeclarationContentCheck] = useState("");
    const declarationList = communityValue.state.selectAllDeclaration || [];

    useEffect(() => {
        let declarated = false;

        if (declarationList.length > 0) {

            declarationList.map((declaration, i) => {
                if (declaration.type_num === props.type_num && declaration.type === props.type && declaration.user_num.userNum === communityValue.state.userNum) {
                    declarated = true;
                }
            });

        }

        setIsDeclaration(declarated);
    }, [communityValue.state.selectAllDeclaration, props.type_num, communityValue.state.userNum]);

    // 신고 버튼
    const handleDeclarationOnSubmit = async () => {
        const check = window.confirm("신고하시겠습니까?");
        if (!check) {
            return;
        }
        if (declarationContent === null || declarationContent === "") {
            setDeclarationContentCheck("내용을 입력해주세요.");
            return;
        }
        setDeclarationContentCheck("");

        const formData = new FormData();
        formData.append("user_num", communityValue.state.userNum);
        formData.append("type", props.type);
        formData.append("type_num", props.type_num);
        formData.append("content", declarationContent);

        await axios.post("http://localhost:8080/insertDeclaration", formData) // 데이터 -> 컨트롤러 요청
            .then((res) => {
                setDeclarationContent("");                                         // 신고 내용 초기화
                setIsDeclarationContent(false);
                setIsDeclarationModalOpen(false);                                  // 신고 모달 닫기
                axios.get("http://localhost:8080/selectAllDeclaration")          // 검색 -> 컨트롤러 요청

                    .then((res) => {                                                   // DB 검색 요청 후 응답
                        communityValue.actions.setSelectAllDeclaration(res.data);      // 커뮤니티 모든 글 신고 검색 데이터 저장
                    })
            })

    }

    return (
        <>
            {
                !isDeclaration && (
                    <>
                        <Tooltip title="신고">
                            <button className='reply-item-menu community-insertBtn' onClick={() => {
                                setIsDeclarationModalOpen(true);
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="6" cy="12" r="2" fill="currentColor" />
                                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                                    <circle cx="18" cy="12" r="2" fill="currentColor" />
                                </svg>
                            </button>
                        </Tooltip>

                        <ReactModal
                            isOpen={isDeclarationModalOpen}
                            onRequestClose={() => {
                                setIsDeclarationModalOpen(false);
                            }}
                            contentLabel="신고 모달"
                            className="ModalDeclaration"
                            overlayClassName="OverlayDeclaration"
                        >
                            <div className='modal-content-declaration'>
                                <div className='declaration-header'>
                                    <h6>신고하기</h6>
                                    <Tooltip title="취소">
                                        <button className="community-insertBtn" onClick={(e) => {
                                            e.preventDefault();
                                            setIsDeclarationContent(false);
                                            setIsDeclarationModalOpen(false);
                                            setDeclarationContentCheck("");
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
                                </div>
                                <form>
                                    <label>
                                        <input type="radio" name="reportReason" value="부적절한 홍보 글을 작성했어요" onChange={(e) => {
                                            setDeclarationContent(e.target.value);
                                            setIsDeclarationContent(false);
                                            setDeclarationContentCheck("");
                                        }} /> 부적절한 홍보 글을 작성했어요
                                    </label>
                                    <label>
                                        <input type="radio" name="reportReason" value="욕설 / 비하 글을 올렸어요" onChange={(e) => {
                                            setDeclarationContent(e.target.value);
                                            setIsDeclarationContent(false);
                                            setDeclarationContentCheck("");
                                        }} /> 욕설 / 비하 글을 올렸어요
                                    </label>
                                    <label>
                                        <input type="radio" name="reportReason" value="중복 / 도배성 글을 올렸어요" onChange={(e) => {
                                            setDeclarationContent(e.target.value);
                                            setIsDeclarationContent(false);
                                            setDeclarationContentCheck("");
                                        }} /> 중복 / 도배성 글을 올렸어요
                                    </label>
                                    <label>
                                        <input type="radio" name="reportReason" value="음란성 글을 올렸어요" onChange={(e) => {
                                            setDeclarationContent(e.target.value);
                                            setIsDeclarationContent(false);
                                            setDeclarationContentCheck("");
                                        }} /> 음란성 글을 올렸어요
                                    </label>
                                    <label>
                                        <input type="radio" name="reportReason" value={declarationContent} onChange={(e) => {
                                            if (e.target.checked) {
                                                setDeclarationContent("");
                                                setIsDeclarationContent(true);
                                            }
                                        }} /> 기타
                                    </label>
                                    {isDeclarationContent && (
                                        <input className="form-control" type="text" maxLength={80} onChange={(e) => {
                                            setDeclarationContent(e.target.value);
                                        }} />
                                    )}
                                    {declarationContentCheck && (<div className="declaration-check">{declarationContentCheck}</div>)}
                                    <button className="form-control btn btn-danger" onClick={(e) => {
                                        e.preventDefault();
                                        handleDeclarationOnSubmit();
                                    }}>신고</button>
                                </form>
                            </div>
                        </ReactModal>
                    </>
                )
            }
        </>
    );
}

export default Declaration;
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './DetailPost.css';
import { useNavigate, Link } from 'react-router-dom';
import CommunityContext from '../../contexts/CommunityContext';
import axiosInstance from '../../../login/component/Token/axiosInstance';
import Modal from 'react-modal';
import UserLike from '../UserLike/UserLike';
import Share from '../Share/Share';
import ImageUpload from '../ImageUpload/ImageUpload';
import Bookmark from '../Bookmark/Bookmark';
import LoginContext from '../../../login/contexts/LoginContext';
import ReplyBtn from '../ReplyBtn/ReplyBtn';
import Reply from '../Reply/Reply';
import { Tooltip } from '@mui/material';

function DetailPost() {
  const navigate = useNavigate();
  const detailPostValue = useContext(CommunityContext);
  const loginValue = useContext(LoginContext);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState(null);                 // form data 제목
  const [titleCheck, setTitleCheck] = useState(null);       // title data 유효성 검사
  const [contents, setContents] = useState("");             // form data 내용
  const [contentsCheck, setContentsCheck] = useState(null); // contents data 유효성 검사
  const [file, setFile] = useState(null);                   // 파일 상태 추가


  const [userProfileImage, setUserProfileImage] = useState(""); // 프로필 이미지 상태 추가

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const userId = detailPostValue.state.selectOnePost.user_num.userId;
        const response = await axios.get(`http://localhost:8080/api/profile-image/${userId}`);
        const profileImageUrl = response.data.profileImageUrl;


        // 프로필 이미지 URL을 조건에 맞게 처리
        if (profileImageUrl.startsWith('http')) {
          setUserProfileImage(profileImageUrl);
        } else {
          setUserProfileImage(`http://localhost:8080${profileImageUrl}`);
        }
      } catch (error) {
        console.error('사용자 프로필 이미지 조회 오류:', error);
      }
    };

    if (detailPostValue.state.selectOnePost) {
      fetchProfileImage();
    }
  }, [detailPostValue.state.selectOnePost]);


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

  const insertTitle = (evt) => {                            // 제목  저장
    setTitle(evt.target.value);
  }

  const insertContents = (evt) => {                         // 내용  저장
    setContents(evt.target.value);
  }

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile); // 파일 상태 업데이트
  };

  const closeModal = () => {
    setIsUpdateModalOpen(!isUpdateModalOpen);
  }

  const updatePostPro = async (evt) => {
    evt.preventDefault();
    dataSubmit(title, contents);
  }

  const dataSubmit = async (title, contents) => {                 // 데이터 -> 컨트롤러

    if (title === null || title === "") {                   // 커뮤니티 아이디 필드가 비어있을 경우

      setTitleCheck("제목을 입력해주세요.");
      return;

    } else {
      setTitleCheck(null);
    }

    if (contents === null || contents === "") {             // 커뮤니티 내용 필드가 비어있을 경우

      setContentsCheck("내용을 입력해주세요.");
      return;

    } else {
      setContentsCheck(null);
    }

    const formData = new FormData();                            // 폼 데이터 가공
    formData.append("id", detailPostValue.state.selectOnePost.id); // 커뮤니티 프라이머리 키
    formData.append('user_num', detailPostValue.state.userNum); // 유저 프라이머리 키 
    formData.append('title', title);                            // 커뮤니티 제목              
    formData.append('contents', contents);                      // 커뮤니티 내용              
    if (file) {
      formData.append('file', file);                            // 커뮤니티 이미지 업로드
    }

    await axios.post("http://localhost:8080/updateCommunity", formData) // 데이터 -> 컨트롤러 요청

      .then((res) => {                                             // DB 입력 요청 후 응 답
        closeModal();
        setTimeout(() => {
          axios.get("http://localhost:8080/selectOneCommunity", { params: { id: res.data } })            // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 입력 요청 후 응답
              detailPostValue.actions.setSelectOnePost(res.data);          // 커뮤니티 모든 글 검색 데이터 저장
            })
        }, 1000);
      })

  }

  const deletePost = () => {
    let check = window.confirm("삭제하시겠습니까?");
    if (check) {
      deletePostPro();
    }
  }

  const deletePostPro = async () => {
    await axios.delete(`http://localhost:8080/deleteCommunity/${detailPostValue.state.selectOnePost.id}`) // 데이터 -> 컨트롤러 요청

      .then((res) => {                                                                              // DB 입력 요청 후 응 답
        navigate("/Community");                                                                     // 글 등록 후 커뮤니티 화면으로 이동
      })
  }

  if (!detailPostValue.state.selectOnePost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">

      <div className='detailCommunity-navbar'>
        <Tooltip title={"뒤로가기"}>
          <button className='detailPost-item-replyBtn' onClick={() => {
            navigate("/Community");
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-menu">
              <path d="M13 17l-5-5 5-5" fill='none' />
              <path d="M18 17l-5-5 5-5" fill='none' />
            </svg>
          </button>
        </Tooltip>
        <div className='detailPost-item-title'>
          {detailPostValue.state.selectOnePost.title}<br />
        </div>

        <div>
          {detailPostValue.state.userNick === detailPostValue.state.selectOnePost.user_num.userNickname ?
            (
              <div>
                <Tooltip title={"글 수정"}>
                  <button className='detailCommunity-insertBtn' onClick={() => {
                    setIsUpdateModalOpen(!isUpdateModalOpen);
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                </Tooltip>

                <Modal
                  isOpen={isUpdateModalOpen}
                  onRequestClose={closeModal}
                  contentLabel="Confirm Delete"
                  className="Modal"
                  overlayClassName="Overlay"
                >
                  <div className='detailPost-item-title'>
                    커뮤니티 글 수정<br />
                  </div>
                  <form action='post'>
                    <ul className="post-list">
                      <li className="post-item">
                        <input className='form-control' placeholder='제목' autoFocus type='text' name='title' onChange={insertTitle} maxLength={100}></input>
                        {titleCheck && <div className='community-check'>{titleCheck}</div>}
                      </li>
                      <li className="post-item">
                        <ImageUpload onFileSelect={handleFileSelect} />
                      </li>
                      <li className="post-item">
                        <textarea className="form-control" placeholder="내용을 작성해주세요" rows="10" name="contents" onChange={insertContents} maxLength={500}></textarea>
                        {contentsCheck && <div className='community-check'>{contentsCheck}</div>}
                      </li>
                    </ul>
                    <Tooltip title={"수정 완료"}>
                      <button className='detailCommunity-menuBtn' onClick={updatePostPro}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                    </Tooltip>
                    <Tooltip title={"취소"}>
                      <button className='detailCommunity-menuBtn' onClick={closeModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </Tooltip>
                  </form>
                </Modal>

                <Tooltip title={"글 삭제"}>
                  <button className='detailCommunity-insertBtn' onClick={deletePost}>
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
            )
            :
            null
          }
        </div>

        {/* <button className='detailCommunity-menuBtn'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-menu">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </button> */}


      </div>

      <ul className="detailPost-list">

        <li className="detailPost-item">

          <Tooltip title={"마이페이지"} placement='top-start'>
            <div className="detailPost-item-top">
              <Link className="no-underline-link" to={`/MemberPage?id=${detailPostValue.state.selectOnePost.user_num.userId}`} state={{ id: detailPostValue.state.selectOnePost.user_num.userId }}>
                <div className='detailPost-item-profile'>
                  <img
                    src={userProfileImage || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    className="profile-image"
                    alt=''
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 이미지로 대체
                      e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                    }} />

                </div>
              </Link>
              <Link className="no-underline-link" to={`/MemberPage?id=${detailPostValue.state.selectOnePost.user_num.userId}`} state={{ id: detailPostValue.state.selectOnePost.user_num.userId }}>
                <div className='detailPost-item-info'>
                  <div className='detailPost-item-userNickname'>{detailPostValue.state.selectOnePost.user_num.userNickname}</div>
                  <div className='detailPost-item-created_at'>{createAtCal(detailPostValue.state.selectOnePost.created_at)}</div>
                </div>
              </Link>
            </div>
          </Tooltip>

          <div className="detailPost-item-middle">

            <div className='detailPost-item-title'>
              {detailPostValue.state.selectOnePost.title}<br />
            </div>

            <div className='detailPost-item-contents'>
              {detailPostValue.state.selectOnePost.contents}<br />
            </div>

          </div>

          <div className="detailPost-item-bottom">
            <div className='post-item-uploadFile'>
              {detailPostValue.state.selectOnePost.image_path &&
                (<img src={`http://localhost:8080/uploads/${detailPostValue.state.selectOnePost.image_path}`}
                  alt={`업로드 이미지`}
                  onError={(e)=>{
                    e.target.src = "uploadFailDefault.png";
                  }}
                />
                )}
            </div>
          </div>

          <div className="detailPost-item-actions">
            <UserLike postId={detailPostValue.state.selectOnePost.id} />
            <ReplyBtn postId={detailPostValue.state.selectOnePost.id} off={1} />
            <Share post={detailPostValue.state.selectOnePost} />
            <Bookmark postId={detailPostValue.state.selectOnePost.id} />
          </div>
        </li>
      </ul>

      <Reply />

    </div>
  );
}

export default DetailPost;
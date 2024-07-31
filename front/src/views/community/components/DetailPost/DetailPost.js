import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './DetailPost.css';
import { useNavigate, Link } from 'react-router-dom';
import CommunityContext from '../../contexts/CommunityContext';
import axiosInstance from '../../../login/component/Token/axiosInstance';
import Modal from 'react-modal';
import UserLike from '../UserLike/UserLike';

function DetailPost() {
  const navigate = useNavigate();
  const detailPostValue = useContext(CommunityContext);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [title, setTitle] = useState(null);                 // form data 제목
  const [titleCheck, setTitleCheck] = useState(null);       // title data 유효성 검사
  const [contents, setContents] = useState("");             // form data 내용
  const [contentsCheck, setContentsCheck] = useState(null); // contents data 유효성 검사

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

    const community = {                                     // 폼 데이터 가공

      id: detailPostValue.state.selectOnePost.id,           // 커뮤니티 글 프라이머리 키
      user_num: { userNum: detailPostValue.state.userNum }, // 유저 프라이머리 키
      title: title,                                         // 커뮤니티 제목
      contents: contents,                                   // 커뮤니티 내용

    }

    await axios.post("http://localhost:8080/updateCommunity", community) // 데이터 -> 컨트롤러 요청

      .then((res) => {                                             // DB 입력 요청 후 응 답
        closeModal();
        axios.get("http://localhost:8080/selectOneCommunity", { params: { id: res.data } })            // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 입력 요청 후 응답
                detailPostValue.actions.setSelectOnePost(res.data);          // 커뮤니티 모든 글 검색 데이터 저장
            })
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

        <button className='detailPost-item-replyBtn' onClick={() => {
          navigate("/Community");
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-menu">
            <path d="M13 17l-5-5 5-5" fill='none' />
            <path d="M18 17l-5-5 5-5" fill='none' />
          </svg>
        </button>

        <div className='detailPost-item-title'>
          {detailPostValue.state.selectOnePost.title}<br />
        </div>

        <div className='detailCommunity-insertBtn'>
          {detailPostValue.state.userNick === detailPostValue.state.selectOnePost.user_num.userNickname ?
            (
              <div>
                <button className='detailCommunity-menuBtn' onClick={() => {
                  setIsUpdateModalOpen(!isUpdateModalOpen);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>

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
                        <textarea className="form-control" placeholder="내용을 작성해주세요" rows="10" name="contents" onChange={insertContents} maxLength={500}></textarea>
                        {contentsCheck && <div className='community-check'>{contentsCheck}</div>}
                      </li>
                    </ul>
                  </form>
                  <button className='detailCommunity-menuBtn' onClick={updatePostPro}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button className='detailCommunity-menuBtn' onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </Modal>

                <button className='detailCommunity-menuBtn' onClick={deletePost}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-trash-simple">
                    <path d="M3 6h18" />
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <path d="M5 6v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6" />
                    <path d="M9 11v6" />
                    <path d="M15 11v6" />
                  </svg>
                </button>
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

          <div className="detailPost-item-top">
            <div className='detailPost-item-profile'><img src="profile.jpeg" className="profile-image"></img></div>
            <div className='detailPost-item-info'>
              <div className='detailPost-item-userNickname'>{detailPostValue.state.selectOnePost.user_num.userNickname}</div>
              <div className='detailPost-item-created_at'>{createAtCal(detailPostValue.state.selectOnePost.created_at)}</div>
            </div>
          </div>

          <div className="detailPost-item-middle">

            <div className='detailPost-item-title'>
              {detailPostValue.state.selectOnePost.title}<br />
            </div>

            <div className='detailPost-item-contents'>
              {detailPostValue.state.selectOnePost.contents}<br />
            </div>

          </div>

          <div className="detailPost-item-bottom">
            <div className='detailPost-item-uploadFile'>
              사진 업로드 파일<br />
            </div>
          </div>

          <div className="detailPost-item-actions">
            <UserLike/>
            <div className='detailPost-item-replyBtn'>
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
            <div className='detailPost-item-share'>
              <svg xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="bi bi-chat">
                <path d="M18 16.08C17.24 16.08 16.56 16.38 16.05 16.88L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.36C15.11 18.58 15.08 18.79 15.08 19C15.08 20.66 16.42 22 18.08 22C19.74 22 21.08 20.66 21.08 19C21.08 17.34 19.74 16 18.08 16H18V16.08Z" />
              </svg>

            </div>
            <div className='detailPost-item-bookmark'>
              {false ?
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
                  <path d="M19 3H5a2 2 0 0 0-2 2v18l7-5 7 5V5a2 2 0 0 0-2-2z" />
                </svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                </svg>
              }
            </div>
          </div>
        </li>
      </ul>
    </div >
  );
}

export default DetailPost;
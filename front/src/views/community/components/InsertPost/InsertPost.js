import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './InsertPost.css';
import { useNavigate } from 'react-router';
import CommunityContext from '../../contexts/CommunityContext';
import ImageUpload from '../ImageUpload/ImageUpload';

function InsertPost() {

  const communityValue = useContext(CommunityContext);
  const navigate = useNavigate();                           // 화면 이동 훅
  const [title, setTitle] = useState(null);                 // form data 제목
  const [titleCheck, setTitleCheck] = useState(null);       // title data 유효성 검사
  const [contents, setContents] = useState("");             // form data 내용
  const [contentsCheck, setContentsCheck] = useState(null); // contents data 유효성 검사

  const insertCommunity = (evt) => {                        // 등록 버튼 함수
    evt.preventDefault();                                   // 고유 이벤트 삭제
    dataSubmit(title, contents);                            // 데이터 -> 컨트롤러 함수 실행
  }

  const insertTitle = (evt) => {                            // 제목  저장
    setTitle(evt.target.value);
  }

  const insertContents = (evt) => {                         // 내용  저장
    setContents(evt.target.value);
  }

  const dataSubmit = (title, contents) => {                 // 데이터 -> 컨트롤러

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
      user_num: { userNum: communityValue.state.userNum },  // 유저 프라이머리 키
      title: title,                                         // 커뮤니티 제목
      contents: contents,                                   // 커뮤니티 내용
    }

    axios.post("http://localhost:8080/insertCommunity", community) // 데이터 -> 컨트롤러 요청

      .then((res) => {                                             // DB 입력 요청 후 응 답
        console.log("insertCommunity res :", res.data);                        // 응답 데이터 확인
        navigate("/Community");                                    // 글 등록 후 커뮤니티 화면으로 이동
      })

  }

  return (
    <div className="container">
      <form action='post' enctype="multipart/form-data">
        <div className='community-navbar'>
          <h2 className="community-header">글 쓰기</h2>
          <button onClick={insertCommunity} className='community-insertBtn'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h9" />
              <path d="M15.9 5.1a2 2 0 0 1 2.8 2.8L8.2 19.6a2 2 0 0 1-1.2.4H3v-4.2a2 2 0 0 1 .4-1.2L15.9 5.1z" />
              <path d="M18.6 7.4l-1.4-1.4" />
            </svg>
          </button>
        </div>
        <ul className="post-list">
          <li className="post-item">
            <input className='form-control' placeholder='제목' autoFocus type='text' name='title' onChange={insertTitle} maxLength={100}></input>
            {titleCheck && <div className='community-check'>{titleCheck}</div>}
          </li>
          <li className="post-item">
            {/* <ImageUpload /> */}
            <textarea className="form-control" placeholder="내용을 작성해주세요" rows="10" name="contents" onChange={insertContents} maxLength={500}></textarea>
            {contentsCheck && <div className='community-check'>{contentsCheck}</div>}
          </li>
        </ul>
      </form>
    </div>
  );
}

export default InsertPost;
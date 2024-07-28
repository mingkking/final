import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './InsertPost.css';
import { useNavigate } from 'react-router';
import CommunityContext from '../../contexts/CommunityContext';

function InsertPost() {

  const communityValue = useContext(CommunityContext);
  const navigate = useNavigate();                     // 화면 이동 훅
  const [title, setTitle] = useState("");             // form data 제목
  const [contents, setContents] = useState("");       // form data 내용

  const insertCommunity = (evt) => {                  // 등록 버튼 함수
    evt.preventDefault();                             // 고유 이벤트 삭제
    dataSubmit(title, contents);                      // 데이터 -> 컨트롤러 함수 실행
  }

  const insertTitle = (evt) => {                      // 제목  저장
    setTitle(evt.target.value);
  }

  const insertContents = (evt) => {                   // 내용  저장
    setContents(evt.target.value);
  }

  const dataSubmit = (title, contents) => {     // 데이터 -> 컨트롤러

    console.log(communityValue.state.userNum);
    const community = {                               // 폼 데이터 가공
      user_num: {userNum: communityValue.state.userNum},
      title: title,
      contents: contents,
    }

    axios.post("http://localhost:8080/insertCommunity", community) // 데이터 -> 컨트롤러 요청

      .then((res) => {
        console.log("Response:", res.data);                              // 응답 데이터 확인
        navigate("/Community");                                          // 글 등록 후 커뮤니티 화면으로 이동
      })

  }

  return (
    <div className="container">
      <form action='post'>
        <div className='community-navbar'>
          <h2 className="community-header">글 쓰기</h2>
          <button onClick={insertCommunity} className='community-insertBtn'>등록</button>
        </div>
        <ul className="post-list">
          <li className="post-item">
            <input className='form-control' placeholder='제목' autoFocus type='text' name='title' onChange={insertTitle}></input>
          </li>
          <li className="post-item">
            <textarea className="form-control" placeholder="내용을 작성해주세요" rows="5" name="contents" onChange={insertContents}></textarea>
          </li>
        </ul>
      </form>
    </div>
  );
}

export default InsertPost;
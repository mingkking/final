import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InsertPost.css';
import { useNavigate } from 'react-router';

function InsertPost() {

  // // Axios 인스턴스 생성
  // const axiosAPI = axios.create({
  //   baseURL: 'http://localhost:8080/api', // 여기에 서버의 baseURL을 설정합니다.
  //   timeout: 1000, // 선택 사항: 요청 타임아웃 설정
  //   headers: { 'Content-Type': 'application/json' }
  // });

  const navigate = useNavigate();
  const [title, setTitle] = useState("");             // form data 제목
  const [contents, setContents] = useState("");       // form data 내용

  const insertCommunity = (evt) => {
    evt.preventDefault();                             // 고유 이벤트 삭제
    console.log("title", title);
    console.log("contents", contents);

    dataSubmit(title, contents);                      // 데이터 -> 컨트롤러 함수 실행
  }

  const insertTitle = (evt) => {                      // 제목  저장
    setTitle(evt.target.value);
  }

  const insertContents = (evt) => {                   // 내용  저장
    setContents(evt.target.value);
  }

  const dataSubmit = (title, contents) => {           // 데이터 -> 컨트롤러
    const community = {
      title: title,
      contents: contents,
    }

    console.log("community submit", community);

    axios.post("http://localhost:8080/insertCommunity", community)
      .then((res) => {
        console.log("Response:", res.data);
        navigate("/Community");
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
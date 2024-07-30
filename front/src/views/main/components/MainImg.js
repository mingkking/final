import React from "react";
import { useNavigate } from 'react-router-dom';
import '../mainCss/MainImg.css'; // CSS 파일 경로를 확인하세요

const MainImg = ({ src, alt, quote, name }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/character/${name}`);
  };

  return (
    <div className="image-container" onClick={handleClick}>
      <img
        src={src} // props로 받은 src를 사용합니다
        alt={alt} // props로 받은 alt를 사용합니다
        className="image"
      />
      <div className="overlay">
        <p className="quote-name">{quote}</p>
        <p className="name">{name}</p>
      </div>
    </div>
  );
};

export default MainImg;

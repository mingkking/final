import React, { useState } from 'react';
import '../sideCss/SideView.css';

const SideStar = ({ totalStars = 5 }) => {
    const [rating, setRating] = useState(0);            // 현재 평점 상태
    const [hoverRating, setHoverRating] = useState(0);  // 마우스 오버 시 평점 상태

    // 별을 클릭했을 때 호출되는 함수
    const handleClick = (ratingValue) => {
        setRating(ratingValue);
    };

    // 별 위에 마우스를 올렸을 때 호출되는 함수
    const handleMouseEnter = (ratingValue) => {
        setHoverRating(ratingValue);
    };

    // 마우스가 별에서 벗어났을 때 호출되는 함수
    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    return (
        <div>
            {[...Array(totalStars)].map((_, index) => {
                const ratingValue = index + 1;                // 현재 별의 평점 값
                return (
                <span
                    key={index}
                    className={`star ${
                    ratingValue <= (hoverRating || rating) ? 'selected' : ''
                    }`}
                    onClick={() => handleClick(ratingValue)}            // 클릭 시 평점 설정
                    onMouseEnter={() => handleMouseEnter(ratingValue)}  // 마우스 오버 시 평점 설정
                    onMouseLeave={handleMouseLeave}                     // 마우스 벗어날 때 평점 초기화
                >
                    ★
                </span>
                );
            })}
        </div>
    );
};

export default SideStar;

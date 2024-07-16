import React, { useState } from 'react';
import '../SideView.css';

const SideStar = ({ totalStars = 5 }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
  
    const handleClick = (ratingValue) => {
      setRating(ratingValue);
    };
  
    const handleMouseEnter = (ratingValue) => {
      setHoverRating(ratingValue);
    };
  
    const handleMouseLeave = () => {
      setHoverRating(0);
    };


    return (
        <div>
            {[...Array(totalStars)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                <span
                    key={index}
                    className={`star ${
                    ratingValue <= (hoverRating || rating) ? 'selected' : ''
                    }`}
                    onClick={() => handleClick(ratingValue)}
                    onMouseEnter={() => handleMouseEnter(ratingValue)}
                    onMouseLeave={handleMouseLeave}
                >
                    ★
                </span>
                );
            })}
        </div>
    );
};

export default SideStar;

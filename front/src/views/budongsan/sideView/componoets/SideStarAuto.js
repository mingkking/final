import React from 'react';
import Tooltip from '@mui/material/Tooltip'; // Tooltip 컴포넌트 import
import '../sideCss/SideView.css'; // 스타일 파일을 임포트합니다.

const SideStarAuto = ({ rating, thresholds, tooltips }) => {
    // 별점 계산 로직
    let stars = 0;
    if (rating === 0) {
        stars = 0;
    } else {
        for (let i = 0; i < thresholds.length; i++) {
            if (rating <= thresholds[i]) {
                stars = i + 1;
                break;
            }
        }
        if (stars === 0) {
            stars = thresholds.length + 1;
        }
    }

    return (
        <div>
            {[...Array(5)].map((_, index) => {
                const starClass = index < stars ? 'star filled' : 'star'; // 별의 채움 상태를 결정합니다.
                const tooltipText = tooltips[index] || ''; // 툴팁 텍스트를 배열에서 가져옵니다.
                return (
                    <Tooltip 
                        key={index} 
                        title={tooltipText} // 툴팁에 표시될 텍스트
                    >
                        <span className={starClass}>
                            ★
                        </span>
                    </Tooltip>
                );
            })}
        </div>
    );
};

export default SideStarAuto;

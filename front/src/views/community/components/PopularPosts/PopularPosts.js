import React from 'react';
import './PopularPosts.css';

const PopularPosts = () => {
    return (
        <div className="popular-posts-container">
            <div className="popular-posts-header">실시간 인기글</div>

            {/* 필터 및 정렬 옵션 (선택 사항) */}
            <div className="popular-posts-controls">
                <select>
                    <option>정렬 기준</option>
                    <option>최신순</option>
                    <option>인기순</option>
                </select>
                <button>필터링</button>
            </div>

            <div className="popular-posts-list">
                {/* 예제 게시글 카드 */}
                <div className="popular-post-card">
                    <div className="popular-post-title">게시글 제목 1</div>
                    <div className="popular-post-content">
                        이곳은 게시글 내용이 들어갑니다. 인기글의 내용을 간단히 설명합니다.
                    </div>
                </div>

                <div className="popular-post-card">
                    <div className="popular-post-title">게시글 제목 2</div>
                    <div className="popular-post-content">
                        또 다른 게시글 내용이 여기에 표시됩니다. 자세한 설명이 포함될 수 있습니다.
                    </div>
                </div>

                {/* 더 많은 게시글 카드 추가 가능 */}
            </div>
        </div>
    );
}

export default PopularPosts;

import React, { useContext, useEffect } from 'react';
import './PopularPosts.css';
import CommunityContext from '../../contexts/CommunityContext';
import { Link } from 'react-router-dom';

const PopularPosts = () => {
    const communityValue = useContext(CommunityContext);
    const popularList = communityValue.state.selectAllPopularPosts || [];

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

    return (
        <div className="popular-posts-container">
            <div className="popular-posts-header">
                <h4>실시간 인기글</h4>
                <h6>{communityValue.state.realTime}</h6>
            </div>

            {popularList.length > 0 ? (
                popularList.map((popularPost, i) => (
                    <Link key={i} className="no-underline-link" to={`/DetailCommunity?id=${popularPost.id}`} state={{ id: popularPost.id }}>
                        <div className="popular-posts-card">

                            <div className="popular-posts-content">
                                {popularPost.contents.length > 15
                                    ? `${popularPost.contents.substring(0, 15)}...`
                                    : popularPost.contents}
                            </div>
                            <div className="popular-posts-item-top">
                                <div className="popular-posts-item-profile">
                                    <img src="profile.jpeg" alt="Profile" className="popular-posts-profile-image" />
                                </div>
                                <div className="popular-posts-item-info">
                                    <div className="popular-posts-item-created_at">{popularPost.user_num.userNickname} &bull; {createAtCal(popularPost.created_at)}</div>
                                </div>
                                <div className="popular-posts-item-upload">
                                    <img src={`http://localhost:8080/uploads/${popularPost.image_path}`} alt={`업로드`}></img>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="no-popular-posts">
                    <p>현재 인기 게시글이 없습니다.</p>
                </div>
            )}

        </div>
    );
}

export default PopularPosts;

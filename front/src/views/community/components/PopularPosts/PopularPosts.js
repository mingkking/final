import React, { useContext, useEffect, useState } from 'react';
import './PopularPosts.css';
import CommunityContext from '../../contexts/CommunityContext';
import { Link } from 'react-router-dom';
import LoginContext from '../../../login/contexts/LoginContext';
import { Tooltip } from '@mui/material';
import axios from 'axios';

const PopularPosts = () => {
    const communityValue = useContext(CommunityContext);
    const loginValue = useContext(LoginContext);
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

    const [userProfiles, setUserProfiles] = useState({}); // 사용자 프로필 저장

    const fetchUserProfiles = async () => {
        try {
            const users = popularList.map(post => post.user_num.userId);
            const response = await Promise.all(users.map(userId => axios.get(`http://localhost:8080/api/profile-image/${userId}`)));

            // response.forEach(({ data }) => {
            //     console.log("Fetched profile data:", data); // 추가된 로그
            // });

            const profiles = response.reduce((acc, { data }) => {
                if (data.userId) {
                    acc[data.userId] = data.profileImageUrl;
                } 
                // else {
                //     console.warn('No userId found in response data:', data);
                // }
                return acc;
            }, {});
            setUserProfiles(profiles);
        } catch (error) {
            console.error('사용자 프로필 조회 오류:', error);
        }
    };

    useEffect(() => {
        if (popularList.length) {
            fetchUserProfiles();
        }
    }, [popularList]);

    return (
        <div className="popular-posts-container">
            <Tooltip title={"좋아요 수가 많은 인기 글 목록입니다."}>
                <div className="popular-posts-header">
                    <h4>실시간 인기글</h4>
                    <h6>{communityValue.state.realTime}</h6>
                </div>
            </Tooltip>

            {popularList.length > 0 ? (
                popularList.map((popularPost, i) => (
                    <Tooltip key={i} title={"인기글 보러가기"}>
                        <Link className="no-underline-link" to={`/DetailCommunity?id=${popularPost.id}`} state={{ id: popularPost.id }}>
                            <div className="popular-posts-card">

                                <div className="popular-posts-content">
                                    {popularPost.contents.length > 15
                                        ? `${popularPost.contents.substring(0, 15)}...`
                                        : popularPost.contents}
                                </div>
                                <div className="popular-posts-item-top">
                                    <div className="popular-posts-item-profile">
                                        <img
                                            src={userProfiles[popularPost.user_num.userId] ?
                                                (userProfiles[popularPost.user_num.userId].startsWith('http') ?
                                                    userProfiles[popularPost.user_num.userId] :
                                                    `http://localhost:8080${userProfiles[popularPost.user_num.userId]}`)
                                                :
                                                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                            alt="Profile"
                                            className="popular-posts-profile-image" />
                                    </div>
                                    <div className="popular-posts-item-info">
                                        <div className="popular-posts-item-created_at">{popularPost.user_num.userNickname} &bull; {createAtCal(popularPost.created_at)}</div>
                                    </div>
                                    <div className="popular-posts-item-upload">
                                        {popularPost.image_path && (<img src={`http://localhost:8080/uploads/${popularPost.image_path}`} alt={`업로드`}></img>)}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </Tooltip>
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

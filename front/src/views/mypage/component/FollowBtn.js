import React, { useState, useEffect, useContext } from 'react';
import axiosInstance from '../../login/component/Token/axiosInstance';
import './FollowBtn.css';
import CommunityContext from '../../community/contexts/CommunityContext';


const FollowBtn = ({ userNum }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const { state: communityState } = useContext(CommunityContext); // 현재 로그인된 사용자 정보 가져오기
    const currentUserId = communityState.userNum; // 사용자 ID가 포함된 상태가 있다고 가정

    useEffect(() => {
        // 팔로우 상태 확인
        const checkIfFollowing = async () => {
          try {
            const response = await axiosInstance.get(`/follow/isFollowing/${currentUserId}/${userNum}`);
            console.log('Follow status:', response.data); // 디버깅용
            setIsFollowing(response.data);
          } catch (error) {
            console.error('Error checking follow status:', error);
          }
        };
    
        if (userNum && currentUserId) {
          checkIfFollowing();
        }
      }, [userNum, currentUserId]);
    
      const handleFollowClick = async () => {
        try {
          if (isFollowing) {
            await axiosInstance.delete(`/follow/${currentUserId}/${userNum}`);
            console.log('Unfollowed successfully'); // 디버깅용
            setIsFollowing(false);
          } else {
            await axiosInstance.post(`/follow/${currentUserId}/${userNum}`);
            console.log('Followed successfully'); // 디버깅용
            setIsFollowing(true);
          }
        } catch (error) {
          console.error('Error toggling follow status:', error);
        }
      };
    
      return (
        <button onClick={handleFollowClick} className={`follow-button ${isFollowing ? 'following' : 'not-following'}`}>
            {isFollowing ? '언팔로우' : '팔로우'}
        </button>
    );
};

export default FollowBtn;
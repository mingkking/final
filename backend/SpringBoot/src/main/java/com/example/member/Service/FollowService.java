package com.example.member.Service;

import com.example.member.domain.FollowVO;

public interface FollowService {
	FollowVO followUser(Integer followerId, Integer followedId);
    void unfollowUser(Integer followerId, Integer followedId);
    boolean isFollowing(Integer followerId, Integer followedId);
    long getFollowersCount(Integer userId);
    long getFollowingCount(Integer userId);
}

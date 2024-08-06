package com.example.member.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.member.domain.FollowVO;
import com.example.member.repository.FollowRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class FollowServiceImpl implements FollowService{
	 @Autowired
	 private FollowRepository followRepository;

	 @Override
	 public FollowVO followUser(Integer followerId, Integer followedId) {
	     FollowVO follow = new FollowVO();
	     follow.setFollowerId(followerId);
	     follow.setFollowedId(followedId);
	     return followRepository.save(follow);
	 }

	 public void unfollowUser(Integer followerId, Integer followedId) {
	        List<FollowVO> follows = followRepository.findByFollowerIdAndFollowedId(followerId, followedId);
	        if (!follows.isEmpty()) {
	            followRepository.deleteAll(follows);
	        } else {
	            throw new EntityNotFoundException("Follow relationship not found");
	        }
	    }

	 public boolean isFollowing(Integer followerId, Integer followedId) {
	        return followRepository.existsByFollowerIdAndFollowedId(followerId, followedId);
	    }

	 @Override
	 public long getFollowersCount(Integer userId) {
	     return followRepository.countByFollowedId(userId);
	 }

	 @Override
	 public long getFollowingCount(Integer userId) {
	     return followRepository.countByFollowerId(userId);
	 }
}

package com.example.member.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.member.domain.FollowVO;

@Repository
public interface FollowRepository extends JpaRepository<FollowVO, Integer> {
	List<FollowVO> findByFollowerIdAndFollowedId(Integer followerId, Integer followedId);
    boolean existsByFollowerIdAndFollowedId(Integer followerId, Integer followedId);
    long countByFollowedId(Integer followedId);
    long countByFollowerId(Integer followerId);
}

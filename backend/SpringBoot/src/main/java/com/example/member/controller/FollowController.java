package com.example.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.member.Service.FollowService;
import com.example.member.domain.FollowVO;

@RestController
@RequestMapping("/api/follow")
public class FollowController {

    @Autowired
    private FollowService followService;

    @PostMapping("/{followerId}/{followedId}")
    public ResponseEntity<FollowVO> followUser(@PathVariable Integer followerId, @PathVariable Integer followedId) {
        FollowVO follow = followService.followUser(followerId, followedId);
        return ResponseEntity.ok(follow);
    }

    @DeleteMapping("/{followerId}/{followedId}")
    public ResponseEntity<Void> unfollowUser(@PathVariable Integer followerId, @PathVariable Integer followedId) {
        try {
            followService.unfollowUser(followerId, followedId);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            // 로그에 오류 메시지 기록
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/isFollowing/{followerId}/{followedId}")
    public ResponseEntity<Boolean> isFollowing(@PathVariable Integer followerId, @PathVariable Integer followedId) {
        try {
            boolean isFollowing = followService.isFollowing(followerId, followedId);
            return ResponseEntity.ok(isFollowing);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/followersCount/{userId}")
    public ResponseEntity<Long> getFollowersCount(@PathVariable Integer userId) {
        long count = followService.getFollowersCount(userId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/followingCount/{userId}")
    public ResponseEntity<Long> getFollowingCount(@PathVariable Integer userId) {
        long count = followService.getFollowingCount(userId);
        return ResponseEntity.ok(count);
    }
}
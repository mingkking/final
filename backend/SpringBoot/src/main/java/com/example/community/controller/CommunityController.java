package com.example.community.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.community.domain.CommunityVO;
import com.example.community.service.CommunityService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommunityController {

    @Autowired
    private CommunityService communityService;                              // 커뮤니티 서비스 객체

    @GetMapping("/selectCommunity") 
    public List<CommunityVO> selectCommunity() {                                         // 커뮤니티 모든 글 검색

        List<CommunityVO> selectAllPosts = null;
        try {
            selectAllPosts = communityService.selectAllCommunity();                      // 커뮤니티 서비스 객체로 커뮤니티 모든 글 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 모든 글 검색 : " + e.getMessage());  // 커뮤니티 모든 글 검색 기능 에러 발생
        }

        return selectAllPosts;

    }

    @GetMapping("/selectOneCommunity") 
    public CommunityVO selectOneCommunity(CommunityVO communityVO) {                                         // 커뮤니티 상세 글 검색

        try {
            communityVO = communityService.selectOneCommunity(communityVO.getId());                      // 커뮤니티 서비스 객체로 커뮤니티 상세 글 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 상세 글 검색 : " + e.getMessage());                // 커뮤니티 글 상세 기능 에러 발생
        }

        return communityVO;

    }

    @PostMapping("/insertCommunity") 
    public void insertCommunity(@RequestBody CommunityVO communityVO) { // 커뮤니티 글 등록 (InsertPost.js 에서 받는 폼 데이터)

        try {
            communityService.insertCommunity(communityVO);              // 커뮤니티 서비스 객체로 커뮤니티 글 등록 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 등록 : " + e.getMessage());  // 커뮤니티 글 등록 기능 에러 발생
        }

    }

}





 




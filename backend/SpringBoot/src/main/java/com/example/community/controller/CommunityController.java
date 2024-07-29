package com.example.community.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.community.domain.CommunityVO;
import com.example.community.service.CommunityService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommunityController {
    @Autowired
    private CommunityService communityService;

    // 사용자 회원가입
    @PostMapping("/insertCommunity")
    public String insertCommunity(@RequestBody CommunityVO communityVO) {
        System.out.println("communityVO.getId() " + communityVO.getId());
        System.out.println("communityVO.getUser_num() " + communityVO.getUser_num());
        System.out.println("communityVO.getTitle() " + communityVO.getTitle());
        System.out.println("communityVO.getContents() " + communityVO.getContents());
        System.out.println("communityVO.getView_count() " + communityVO.getView_count());
        System.out.println("communityVO.getCreated_at() " + communityVO.getCreated_at());

        try {
            communityService.insertCommunity(communityVO);
        } catch (Exception e) {
            System.out.println("커뮤니티 글 등록 : " + e.getMessage());
        }

        return "1"; 
    }

}





 




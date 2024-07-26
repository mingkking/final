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
        System.out.println("communityVO.getTitle() " + communityVO.getTitle());
        System.out.println("communityVO.getContents() " + communityVO.getContents());

        return "1"; 
    }

}





 




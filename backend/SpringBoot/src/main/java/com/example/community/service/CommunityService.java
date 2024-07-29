package com.example.community.service;

import org.springframework.stereotype.Service;

import com.example.community.domain.CommunityVO;

@Service
public interface CommunityService {
    public void insertCommunity(CommunityVO communityVO) throws Exception;
}
 
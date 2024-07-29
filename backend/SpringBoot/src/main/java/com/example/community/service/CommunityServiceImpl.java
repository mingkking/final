package com.example.community.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.community.domain.CommunityVO;
import com.example.community.repository.CommunityRepository;

@Service
public class CommunityServiceImpl implements CommunityService{

    @Autowired 
    private CommunityRepository communityRepository;

    @Override
    public List<CommunityVO> selectAllCommunity() throws Exception {
        return communityRepository.selectAllCommunity();
    }

    @Override
    public void insertCommunity(CommunityVO communityVO) throws Exception {
        communityRepository.save(communityVO);
    }

}

package com.example.community.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.community.repository.CommunityRepository;

@Service
public class CommunityServiceImpl implements CommunityService{

    @Autowired 
    private CommunityRepository communityRepository;

}

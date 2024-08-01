package com.example.community.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.community.domain.CommunityVO;
import com.example.community.domain.UserLikeVO;
import com.example.community.repository.CommunityRepository;
import com.example.community.repository.UserLikeRepository;

@Service
public class CommunityServiceImpl implements CommunityService{

    @Autowired
    private CommunityRepository communityRepository;

    @Autowired
    private UserLikeRepository userLikeRepository;

    @Override
    public List<CommunityVO> selectAllCommunity() throws Exception {
        return communityRepository.selectAllCommunity();
    }

    @Override
    public CommunityVO selectOneCommunity(Integer id) throws Exception {
        return communityRepository.selectOneCommunity(id);
    }

    @Override
    public void insertCommunity(CommunityVO communityVO) throws Exception {
        communityRepository.save(communityVO);
    }

    @Override
    public void updateCommunity(CommunityVO communityVO) throws Exception {
        CommunityVO selectVO = communityRepository.selectOneCommunity(communityVO.getId());
        
        selectVO.getUser_num().setUserNum(communityVO.getUser_num().getUserNum());
        selectVO.setTitle(communityVO.getTitle());
        selectVO.setContents(communityVO.getContents());

        communityRepository.save(selectVO);
    }

    @Override
    public void deleteCommunity(Integer id) throws Exception {
        communityRepository.deleteById(id);
    }

    @Override
    public List<CommunityVO> selectAllPopularCommunity() throws Exception {
        return communityRepository.selectAllPopularCommunity();
    }

    @Override
    public List<UserLikeVO> selectAllUserLike() throws Exception {
        return userLikeRepository.findAll();
    }

    @Override
    public void insertUserLike(UserLikeVO userLikeVO) throws Exception {
        userLikeRepository.save(userLikeVO);
    }

    @Override
    public void deleteUserLike(Integer userNum, Integer id) throws Exception {
        userLikeRepository.deleteUserLike(userNum, id);;
    }

    

}

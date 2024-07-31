package com.example.community.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.example.community.domain.CommunityVO;
import com.example.community.domain.UserLikeVO;

@Service
public interface CommunityService {
    // 네이티브 쿼리를 사용
    @Query(value = "SELECT * FROM COMMUNITY ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllCommunity() throws Exception;

    @Query(value = "SELECT * FROM COMMUNITY WHERE id = ?1", nativeQuery = true)
    public CommunityVO selectOneCommunity(Integer id) throws Exception;

    public void insertCommunity(CommunityVO communityVO) throws Exception;

    public void updateCommunity(CommunityVO communityVO) throws Exception;

    public void deleteCommunity(Integer id) throws Exception;

    public void insertUserLike(UserLikeVO userLikeVO) throws Exception;

}
 
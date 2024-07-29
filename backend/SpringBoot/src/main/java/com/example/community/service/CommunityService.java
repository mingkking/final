package com.example.community.service;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.example.community.domain.CommunityVO;

@Service
public interface CommunityService {
    public void insertCommunity(CommunityVO communityVO) throws Exception;

    // 네이티브 쿼리를 사용
    @Query(value = "SELECT * FROM COMMUNITY ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllCommunity() throws Exception;
}
 
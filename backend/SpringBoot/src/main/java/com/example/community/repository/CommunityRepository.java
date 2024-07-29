package com.example.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.CommunityVO;

@Repository
public interface CommunityRepository extends JpaRepository<CommunityVO, Integer> {

    // 네이티브 쿼리를 사용
    @Query(value = "SELECT * FROM COMMUNITY ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllCommunity() throws Exception;

}      
 
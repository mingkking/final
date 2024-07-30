package com.example.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.CommunityVO;

@Repository
public interface CommunityRepository extends JpaRepository<CommunityVO, Integer> {

    // 커뮤니티 글 조회
    @Query(value = "SELECT * FROM COMMUNITY ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllCommunity() throws Exception;

    @Query(value = "SELECT * FROM COMMUNITY WHERE id = ?1", nativeQuery = true)
    public CommunityVO selectOneCommunity(Integer id) throws Exception;

    // 인기 글 조회
    @Query(value = "SELECT * FROM COMMUNITY ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllPopularCommunity() throws Exception;

}      
 
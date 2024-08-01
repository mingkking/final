package com.example.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.CommunityVO;
import com.example.community.domain.UserLikeVO;

@Repository
public interface CommunityRepository extends JpaRepository<CommunityVO, Integer> {

    // 커뮤니티 글 조회
    @Query(value = "SELECT * FROM COMMUNITY ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllCommunity() throws Exception;

    @Query(value = "SELECT * FROM COMMUNITY WHERE id = ?1", nativeQuery = true)
    public CommunityVO selectOneCommunity(Integer id) throws Exception;

    // 인기 글 조회
    @Query(value = "SELECT c.*, u.cnt\r\n" + //
                "FROM community c\r\n" + //
                "JOIN (\r\n" + //
                "    SELECT ID, COUNT(*) AS cnt\r\n" + //
                "    FROM USERLIKE\r\n" + //
                "    GROUP BY ID\r\n" + //
                "    ORDER BY cnt DESC\r\n" + //
                ") u ON c.id = u.id\r\n" + //
                "WHERE u.cnt IS NOT NULL\r\n" + //
                "AND ROWNUM <= 7\r\n" + //
                "ORDER BY u.cnt DESC, c.created_at ASC", nativeQuery = true)
    public List<CommunityVO> selectAllPopularCommunity() throws Exception;

}      
 
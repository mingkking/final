package com.example.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.CommunityVO;

@Repository
public interface CommunityRepository extends JpaRepository<CommunityVO, Integer> {

    // // 커뮤니티 글 조회
    // @Query(value = "SELECT * FROM (\n" + //
    //             "  SELECT a.*, ROWNUM rnum\n" + //
    //             "  FROM (\n" + //
    //             "    SELECT * FROM community\n" + //
    //             "    ORDER BY created_at DESC\n" + //
    //             "  ) a\n" + //
    //             "  WHERE ROWNUM <= :endRow\n" + //
    //             ")\n" + //
    //             "WHERE rnum > :startRow", nativeQuery = true)
    // public List<CommunityVO> selectAllCommunity(Integer startRow, Integer endRow) throws Exception;
    @Query(value = "SELECT * FROM community ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllCommunity() throws Exception;

    // 커뮤니티 글 검색 조회
    @Query(value = "SELECT * FROM community WHERE title LIKE '%' || ?1 || '%' OR contents LIKE '%' || ?1 || '%' ORDER BY created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectSearchCommunity(String keyword) throws Exception;

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
                "ORDER BY u.cnt DESC, c.created_at DESC", nativeQuery = true)
    public List<CommunityVO> selectAllPopularCommunity() throws Exception;
    


}      
 
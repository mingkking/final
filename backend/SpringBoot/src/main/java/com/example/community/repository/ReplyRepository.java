package com.example.community.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.community.domain.ReplyVO;

@Repository
public interface ReplyRepository extends JpaRepository<ReplyVO, Integer> {
    // 커뮤니티 댓글 조회
    @Query(value = "SELECT * FROM REPLY WHERE id=?1 ORDER BY created_at ASC", nativeQuery = true)
    public List<ReplyVO> selectAllReply(Integer id) throws Exception;

    // 커뮤니티 댓글 1개 검색
    @Query(value = "SELECT * FROM REPLY WHERE reply_num = ?1", nativeQuery = true)
    public ReplyVO selectOneReply(Integer reply_num) throws Exception;
    
    // 댓글 개수
    @Query(value = "SELECT \r\n" + //
                "    r.id AS id,\r\n" + //
                "    COALESCE(reply_count, 0) AS reply_count,\r\n" + //
                "    COALESCE(rereply_count, 0) AS rereply_count,\r\n" + //
                "    COALESCE(reply_count, 0) + COALESCE(rereply_count, 0) AS total_count\r\n" + //
                "FROM\r\n" + //
                "    (SELECT id, COUNT(*) AS reply_count\r\n" + //
                "     FROM reply\r\n" + //
                "     GROUP BY id) r\r\n" + //
                "LEFT JOIN\r\n" + //
                "    (SELECT r.id, COUNT(*) AS rereply_count\r\n" + //
                "     FROM rereply rr\r\n" + //
                "     JOIN reply r ON rr.reply_num = r.reply_num\r\n" + //
                "     GROUP BY r.id) rr\r\n" + //
                "ON r.id = rr.id", nativeQuery = true)
    public List<Map<String, Object>> selectAllReplyCnt() throws Exception;
}

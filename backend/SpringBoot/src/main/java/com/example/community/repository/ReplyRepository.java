package com.example.community.repository;

import java.util.List;

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
}

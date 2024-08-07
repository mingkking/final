package com.example.community.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.community.domain.ReReplyVO;

public interface ReReplyRepository extends JpaRepository<ReReplyVO, Integer> {
    // 커뮤니티 대댓글 조회
    @Query(value = "SELECT * FROM REREPLY ORDER BY created_at ASC", nativeQuery = true)
    public List<ReReplyVO> selectAllReReply() throws Exception;
}

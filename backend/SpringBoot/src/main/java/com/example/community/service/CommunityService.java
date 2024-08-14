package com.example.community.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.example.community.domain.BookmarkVO;
import com.example.community.domain.CommunityVO;
import com.example.community.domain.DeclarationVO;
import com.example.community.domain.ReReplyVO;
import com.example.community.domain.ReplyVO;
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

    public List<CommunityVO> selectAllPopularCommunity() throws Exception;

    public List<UserLikeVO> selectAllUserLike() throws Exception;

    // 좋아요 id, 개수
    @Query(value = "SELECT id, count(*) FROM USERLIKE GROUP BY id", nativeQuery = true)
    public List<Map<String, Object>> selectAllUserLikeCnt() throws Exception;

    public void insertUserLike(UserLikeVO userLikeVO) throws Exception;

    public void deleteUserLike(Integer userNum, Integer id) throws Exception;

    public List<BookmarkVO> selectAllBookmark() throws Exception;

    public void insertBookmark(BookmarkVO bookmarkVO) throws Exception;

    public void deleteBookmark(Integer userNum, Integer id) throws Exception;

    // 커뮤니티 댓글 조회
    @Query(value = "SELECT * FROM REPLY WHERE id=?1 ORDER BY created_at ASC", nativeQuery = true)
    public List<ReplyVO> selectAllReply(Integer id) throws Exception;

    // 커뮤니티 댓글 1개 검색
    @Query(value = "SELECT * FROM REPLY WHERE reply_num = ?1", nativeQuery = true)
    public ReplyVO selectOneReply(Integer reply_num) throws Exception;

    public void insertReply(ReplyVO replyVO) throws Exception;

    public void updateReply(ReplyVO replyVO) throws Exception;

    public void deleteReply(Integer reply_num) throws Exception;

    // 커뮤니티 대댓글 조회
    @Query(value = "SELECT * FROM REREPLY ORDER BY created_at ASC", nativeQuery = true)
    public List<ReReplyVO> selectAllReReply() throws Exception;

    // 커뮤니티 대댓글 1개 검색
    @Query(value = "SELECT * FROM REREPLY WHERE rereply_num = ?1", nativeQuery = true)
    public ReReplyVO selectOneReReply(Integer rereply_num) throws Exception;

    public void insertReReply(ReReplyVO reReplyVO) throws Exception;

    public void updateReReply(ReReplyVO reReplyVO) throws Exception;

    public void deleteReReply(Integer rereply_num) throws Exception;

    List<ReplyVO> selectAllReply() throws Exception;

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

    // 모든 신고 리스트
    @Query(value = "SELECT * FROM DECLARATION", nativeQuery = true)
    public List<DeclarationVO> selectAllDeclaration() throws Exception;

    // 커뮤니티 신고 등록
    public void insertDeclaration(DeclarationVO declarationVO) throws Exception;
}
 
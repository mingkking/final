package com.example.community.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.example.community.domain.BookmarkVO;
import com.example.community.domain.CommunityVO;
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

    public void insertUserLike(UserLikeVO userLikeVO) throws Exception;

    public void deleteUserLike(Integer userNum, Integer id) throws Exception;

    public List<BookmarkVO> selectAllBookmark() throws Exception;

    public void insertBookmark(BookmarkVO bookmarkVO) throws Exception;

    public void deleteBookmark(Integer userNum, Integer id) throws Exception;

    // 커뮤니티 댓글 조회
    @Query(value = "SELECT * FROM REPLY WHERE id=?1 ORDER BY created_at ASC", nativeQuery = true)
    public List<ReplyVO> selectAllReply(Integer id) throws Exception;

    public void insertReply(ReplyVO replyVO) throws Exception;

}
 
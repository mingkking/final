package com.example.community.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.community.domain.BookmarkVO;
import com.example.community.domain.CommunityVO;
import com.example.community.domain.DeclarationVO;
import com.example.community.domain.ReReplyVO;
import com.example.community.domain.ReplyVO;
import com.example.community.domain.UserLikeVO;
import com.example.community.repository.BookmarkRepository;
import com.example.community.repository.CommunityRepository;
import com.example.community.repository.DeclarationRepository;
import com.example.community.repository.ReReplyRepository;
import com.example.community.repository.ReplyRepository;
import com.example.community.repository.UserLikeRepository;

@Service
public class CommunityServiceImpl implements CommunityService {

    // 커뮤니티
    @Autowired
    private CommunityRepository communityRepository;

    // 좋아요
    @Autowired
    private UserLikeRepository userLikeRepository;

    // 북마크
    @Autowired
    private BookmarkRepository bookmarkRepository;

    // 댓글
    @Autowired
    private ReplyRepository replyRepository;

    // 대댓글
    @Autowired
    private ReReplyRepository reReplyRepository;

    // 신고
    @Autowired
    private DeclarationRepository declarationRepository;

    @Override
    public List<CommunityVO> selectAllCommunity() throws Exception {
        return communityRepository.selectAllCommunity();
    }

    @Override
    public CommunityVO selectOneCommunity(Integer id) throws Exception {
        return communityRepository.selectOneCommunity(id);
    }

    @Override
    public void insertCommunity(CommunityVO communityVO) throws Exception {
        communityRepository.save(communityVO);
    }

    @Override
    public void updateCommunity(CommunityVO communityVO) throws Exception {
        CommunityVO selectVO = communityRepository.selectOneCommunity(communityVO.getId());

        selectVO.getUser_num().setUserNum(communityVO.getUser_num().getUserNum());
        selectVO.setTitle(communityVO.getTitle());
        selectVO.setImage_path(communityVO.getImage_path());
        selectVO.setContents(communityVO.getContents());

        communityRepository.save(selectVO);
    }

    @Override
    public void deleteCommunity(Integer id) throws Exception {
        communityRepository.deleteById(id);
    }

    @Override
    public List<CommunityVO> selectAllPopularCommunity() throws Exception {
        return communityRepository.selectAllPopularCommunity();
    }

    @Override
    public List<UserLikeVO> selectAllUserLike() throws Exception {
        return userLikeRepository.findAll();
    }

    // 좋아요 id, 개수
    @Override
    public List<Map<String, Object>> selectAllUserLikeCnt() throws Exception {
        return userLikeRepository.selectAllUserLikeCnt();
    }

    @Override
    public void insertUserLike(UserLikeVO userLikeVO) throws Exception {
        userLikeRepository.save(userLikeVO);
    }

    @Override
    public void deleteUserLike(Integer userNum, Integer id) throws Exception {
        userLikeRepository.deleteUserLike(userNum, id);
        ;
    }

    @Override
    public List<BookmarkVO> selectAllBookmark() throws Exception {
        return bookmarkRepository.findAll();
    }

    @Override
    public void insertBookmark(BookmarkVO bookmarkVO) throws Exception {
        bookmarkRepository.save(bookmarkVO);
    }

    @Override
    public void deleteBookmark(Integer userNum, Integer id) throws Exception {
        bookmarkRepository.deleteBookmark(userNum, id);
    }

    @Override
    public List<ReplyVO> selectAllReply(Integer id) throws Exception {
        return replyRepository.selectAllReply(id);
    }

    @Override
    public ReplyVO selectOneReply(Integer reply_num) throws Exception {
        return replyRepository.selectOneReply(reply_num);
    }

    @Override
    public void insertReply(ReplyVO replyVO) throws Exception {
        replyRepository.save(replyVO);
    }

    @Override
    public void updateReply(ReplyVO replyVO) throws Exception {
        ReplyVO selectVO = replyRepository.selectOneReply(replyVO.getReply_num());
        selectVO.setContent(replyVO.getContent());
        replyRepository.save(selectVO);
    }

    @Override
    public void deleteReply(Integer reply_num) throws Exception {
        replyRepository.deleteById(reply_num);
    }

    @Override
    public List<ReReplyVO> selectAllReReply() throws Exception {
        return reReplyRepository.selectAllReReply();
    }

    @Override
    public ReReplyVO selectOneReReply(Integer rereply_num) throws Exception {
        return reReplyRepository.selectOneReReply(rereply_num);
    }

    @Override
    public void insertReReply(ReReplyVO reReplyVO) throws Exception {
        reReplyRepository.save(reReplyVO);
    }

    @Override
    public void updateReReply(ReReplyVO reReplyVO) throws Exception {
        ReReplyVO selectVO = reReplyRepository.selectOneReReply(reReplyVO.getRereply_num());
        selectVO.setContent(reReplyVO.getContent());
        reReplyRepository.save(selectVO);
    }

    @Override
    public void deleteReReply(Integer rereply_num) throws Exception {
        reReplyRepository.deleteById(rereply_num);
    }

    @Override
    public List<ReplyVO> selectAllReply() throws Exception {
        return replyRepository.findAll(); 
    }

    // 댓글 개수
    @Override
    public List<Map<String, Object>> selectAllReplyCnt() throws Exception {
        return replyRepository.selectAllReplyCnt();
    }

    // 모든 신고 리스트
    @Override
    public List<DeclarationVO> selectAllDeclaration() throws Exception {
        return declarationRepository.selectAllDeclaration();
    }

    // 커뮤니티 신고 등록
    @Override
    public void insertDeclaration(DeclarationVO declarationVO) throws Exception {
        declarationRepository.save(declarationVO);
    }

}

package com.example.community.controller;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.community.domain.BookmarkVO;
import com.example.community.domain.CommunityVO;
import com.example.community.domain.ReReplyVO;
import com.example.community.domain.ReplyVO;
import com.example.community.domain.UserLikeVO;
import com.example.community.service.CommunityService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommunityController {
    // 파일 업로드를 위한 기본 폴더 경로
    private static final String UPLOADED_FOLDER = System.getProperty("user.dir")
            + "/backend/SpringBoot/src/main/resources/static/uploads/";

    @Autowired
    private CommunityService communityService; // 커뮤니티 서비스 객체

    @GetMapping("/selectCommunity")
    public List<CommunityVO> selectCommunity() { // 커뮤니티 모든 글 검색

        List<CommunityVO> selectAllPosts = null;
        try {
            selectAllPosts = communityService.selectAllCommunity(); // 커뮤니티 서비스 객체로 커뮤니티 모든 글 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 모든 글 검색 : " + e.getMessage()); // 커뮤니티 모든 글 검색 기능 에러 발생
        }

        return selectAllPosts;

    }

    @GetMapping("/selectOneCommunity")
    public CommunityVO selectOneCommunity(CommunityVO communityVO) { // 커뮤니티 상세 글 검색

        try {
            communityVO = communityService.selectOneCommunity(communityVO.getId()); // 커뮤니티 서비스 객체로 커뮤니티 상세 글 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 상세 글 검색 : " + e.getMessage()); // 커뮤니티 글 상세 기능 에러 발생
        }

        return communityVO;

    }

    // 커뮤니티 글 등록 (InsertPost.js 에서 받는 폼 데이터)
    @PostMapping("/insertCommunity")
    public void insertCommunity(
            @ModelAttribute CommunityVO communityVO,
            @RequestParam(value = "file", required = false) MultipartFile imageFile) {

        try {
            // 파일이 존재하면 서버에 저장
            if (imageFile != null && !imageFile.isEmpty()) {
                String fileName = imageFile.getOriginalFilename(); // 파일명
                UUID uuid = UUID.randomUUID(); // 파일 겹치지 않게 아이디 값 추가
                String fileRealPathName = uuid.toString() + "_" + fileName; // 아이디값_파일명

                communityVO.setImage_path(fileRealPathName); // 아이디값_파일명 VO에 저장

                // 저장할 디렉토리 생성
                File dir = new File(UPLOADED_FOLDER);
                if (!dir.exists()) {
                    dir.mkdirs(); // 디렉토리가 없으면 생성
                }
                System.out.println("============================================" + UPLOADED_FOLDER + fileRealPathName);
                File file = new File(UPLOADED_FOLDER + fileRealPathName); // 실제파일 저장
                imageFile.transferTo(file); // 실제 파일 저장
            }

            communityService.insertCommunity(communityVO); // 커뮤니티 서비스 객체로 커뮤니티 글 등록 기능
            // 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 등록 : " + e.getMessage()); // 커뮤니티 글 등록 기능 에러 발생
        }

    }

    @PostMapping("/updateCommunity")
    public Integer updateCommunity(@ModelAttribute CommunityVO communityVO,
            @RequestParam(value = "file", required = false) MultipartFile imageFile) { // 커뮤니티 글 수정 (DetailPost.js 에서 받는
                                                                                       // 폼 데이터)
        try {
            // 수정할 때 파일 존재 유무 판단
            if (imageFile != null && !imageFile.isEmpty()) {
                CommunityVO fileCVO = communityService.selectOneCommunity(communityVO.getId()); // 기존에 있던 파일 명을 가져오기 위해
                                                                                                // 상세 검색
                File deletefile = new File(UPLOADED_FOLDER + fileCVO.getImage_path()); // 기존에 있던 파일 삭제

                if (deletefile.exists()) { // 존재유무 판단 후 삭제
                    deletefile.delete(); // 파일 삭제 메소드
                }

                String fileName = imageFile.getOriginalFilename(); // 파일명
                UUID uuid = UUID.randomUUID(); // 파일 겹치지 않게 아이디 값 추가
                String fileRealPathName = uuid.toString() + "_" + fileName; // 아이디값_파일명

                communityVO.setImage_path(fileRealPathName); // 아이디값_파일명 VO에 저장

                File file = new File(UPLOADED_FOLDER + fileRealPathName); // 실제파일 저장
                imageFile.transferTo(file); // 실제 파일 저장
            }

            communityService.updateCommunity(communityVO); // 커뮤니티 서비스 객체로 커뮤니티 글 수정 기능
        } catch (Exception e) {
            System.out.println("커뮤니티 글 수정 : " + e.getMessage()); // 커뮤니티 글 수정 기능 에러 발생
        }

        return communityVO.getId();
    }

    @DeleteMapping("/deleteCommunity/{id}")
    public void deleteCommunity(@PathVariable Integer id) { // 커뮤니티 글 삭제 (DetailPost.js 에서 받는 폼 데이터)

        try {
            CommunityVO communityVO = communityService.selectOneCommunity(id); // 기존에 있던 파일 명을 가져오기 위해 상세 검색
            File deletefile = new File(UPLOADED_FOLDER + communityVO.getImage_path()); // 기존에 있던 파일 삭제

            if (deletefile.exists()) { // 존재유무 판단 후 삭제
                deletefile.delete(); // 파일 삭제 메소드
            }

            communityService.deleteCommunity(id); // 커뮤니티 서비스 객체로 커뮤니티 글 삭제 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 삭제 : " + e.getMessage()); // 커뮤니티 글 삭제 기능 에러 발생
        }

    }

    @GetMapping("/selectPopularCommunity")
    public List<CommunityVO> selectPopularCommunity() { // 커뮤니티 모든 인기 글 검색

        List<CommunityVO> selectAllPopularPosts = null;
        try {
            selectAllPopularPosts = communityService.selectAllPopularCommunity(); // 커뮤니티 서비스 객체로 커뮤니티 모든 인기 글 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 모든 인기 글 검색 : " + e.getMessage()); // 커뮤니티 모든 인기 글 검색 기능 에러 발생
        }

        return selectAllPopularPosts;

    }

    @GetMapping("/selectAllUserLike")
    public List<UserLikeVO> selectAllUserLike() { // 커뮤니티 모든 글 좋아요 검색

        List<UserLikeVO> selectAllUserLike = null;
        try {
            selectAllUserLike = communityService.selectAllUserLike(); // 커뮤니티 서비스 객체로 커뮤니티 모든 글 좋아요 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 모든 글 좋아요 검색 : " + e.getMessage()); // 커뮤니티 모든 글 좋아요 검색 기능 에러 발생
        }

        return selectAllUserLike;

    }

    @PostMapping("/insertUserLike")
    public void insertUserLike(@RequestBody UserLikeVO userLikeVO) { // 커뮤니티 글 좋아요 등록 (UserLike.js 에서 받는 폼 데이터)

        try {
            communityService.insertUserLike(userLikeVO); // 커뮤니티 서비스 객체로 커뮤니티 글 좋아요 등록 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 좋아요 등록 : " + e.getMessage()); // 커뮤니티 글 좋아요 등록 기능 에러 발생
        }

    }

    @PostMapping("/deleteUserLike")
    public void deleteUserLike(@RequestBody UserLikeVO userLikeVO) { // 커뮤니티 글 좋아요 삭제 (UserLike.js 에서 받는 폼 데이터)

        try {
            communityService.deleteUserLike(userLikeVO.getUser_num().getUserNum(), userLikeVO.getId().getId()); // 커뮤니티
                                                                                                                // 서비스
                                                                                                                // 객체로
                                                                                                                // 커뮤니티
                                                                                                                // 글 좋아요
                                                                                                                // 삭제 기능
                                                                                                                // 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 좋아요 삭제 : " + e.getMessage()); // 커뮤니티 글 좋아요 삭제 기능 에러 발생
        }

    }

    @GetMapping("/selectAllBookmark")
    public List<BookmarkVO> selectAllBookmark() { // 커뮤니티 모든 글 북마크 검색

        List<BookmarkVO> selectAllBookmark = null;
        try {
            selectAllBookmark = communityService.selectAllBookmark(); // 커뮤니티 서비스 객체로 커뮤니티 모든 글 북마크 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 모든 글 북마크 검색 : " + e.getMessage()); // 커뮤니티 모든 글 북마크 검색 기능 에러 발생
        }

        return selectAllBookmark;

    }

    @PostMapping("/insertBookmark")
    public void insertBookmark(@RequestBody BookmarkVO bookmarkVO) { // 커뮤니티 글 북마크 등록 (UserLike.js 에서 받는 폼 데이터)

        try {
            communityService.insertBookmark(bookmarkVO); // 커뮤니티 서비스 객체로 커뮤니티 글 북마크 등록 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 북마크 등록 : " + e.getMessage()); // 커뮤니티 글 북마크 등록 기능 에러 발생
        }

    }

    @PostMapping("/deleteBookmark")
    public void deleteBookmark(@RequestBody BookmarkVO bookmarkVO) { // 커뮤니티 글 북마크 삭제 (UserLike.js 에서 받는 폼 데이터)

        try {
            communityService.deleteBookmark(bookmarkVO.getUser_num().getUserNum(), bookmarkVO.getId().getId()); // 커뮤니티
                                                                                                                // 서비스
                                                                                                                // 객체로
                                                                                                                // 커뮤니티
                                                                                                                // 글 북마크
                                                                                                                // 삭제 기능
                                                                                                                // 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 북마크 삭제 : " + e.getMessage()); // 커뮤니티 글 북마크 삭제 기능 에러 발생
        }

    }

    @GetMapping("/selectAllReply")
    public List<ReplyVO> selectAllReply(@RequestParam("id") Integer id) { // 커뮤니티 모든 댓글 검색
        List<ReplyVO> selectAllReply = null;
        try {
            selectAllReply = communityService.selectAllReply(id); // 커뮤니티 서비스 객체로 커뮤니티 모든 댓글 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 모든 댓글 검색 : " + e.getMessage()); // 커뮤니티 모든 댓글 검색 기능 에러 발생
        }

        return selectAllReply;

    }

    // 커뮤니티 댓글 등록 
    @PostMapping("/insertReply")
    public void insertReply(@ModelAttribute ReplyVO replyVO) { // 커뮤니티 댓글 등록 (Reply.js 에서 받는 폼 데이터)

        try {
            communityService.insertReply(replyVO); // 커뮤니티 서비스 객체로 커뮤니티 댓글 등록 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 댓글 등록 : " + e.getMessage()); // 커뮤니티 댓글 등록 기능 에러 발생
        }

    }

    // 커뮤니티 댓글 수정 
    @PostMapping("/updateReply")
    public void updateReply(@ModelAttribute ReplyVO replyVO) { 

        try {
            communityService.updateReply(replyVO); // 커뮤니티 서비스 객체로 커뮤니티 댓글 수정 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 댓글 수정 : " + e.getMessage()); // 커뮤니티 댓글 수정 기능 에러 발생
        }

    }

    // 커뮤니티 댓글 삭제
    @DeleteMapping("/deleteReply/{id}")
    public void deleteReply(@PathVariable Integer id) { // 커뮤니티 댓글 삭제 (DetailPost.js 에서 받는 폼 데이터)

        try {
            communityService.deleteReply(id); // 커뮤니티 서비스 객체로 커뮤니티 댓글 삭제 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 댓글 삭제 : " + e.getMessage()); // 커뮤니티 댓글 삭제 기능 에러 발생
        }

    }

    // 커뮤니티 대댓글 전체 검색
    @GetMapping("/selectAllReReply")
    public List<ReReplyVO> selectAllReReply() { // 커뮤니티 모든 대댓글 검색
        List<ReReplyVO> selectAllReReply = null;
        try {
            selectAllReReply = communityService.selectAllReReply(); // 커뮤니티 서비스 객체로 커뮤니티 모든 대댓글 검색 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 모든 대댓글 검색 : " + e.getMessage()); // 커뮤니티 모든 대댓글 검색 기능 에러 발생
        }

        return selectAllReReply;

    }

    // 커뮤니티 대댓글 등록
    @PostMapping("/insertReReply")
    public void insertReReply(@ModelAttribute ReReplyVO reReplyVO) { // 커뮤니티 대댓글 등록 (Rereply.js 에서 받는 폼 데이터)
        System.out.println("reReplyVO.toString() reReplyVO.toString() reReplyVO.toString() " + reReplyVO.toString());

        try {
            communityService.insertReReply(reReplyVO); // 커뮤니티 서비스 객체로 커뮤니티 대댓글 등록 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 대댓글 등록 : " + e.getMessage()); // 커뮤니티 대댓글 등록 기능 에러 발생
        }

    }

    // 커뮤니티 대댓글 수정
    @PostMapping("/updateReReply")
    public void updateReReply(@ModelAttribute ReReplyVO reReplyVO) { 
        System.out.println("reReplyVO.toString() reReplyVO.toString() reReplyVO.toString() " + reReplyVO.toString());

        try {
            communityService.updateReReply(reReplyVO); // 커뮤니티 서비스 객체로 커뮤니티 대댓글 수정 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 대댓글 수정 : " + e.getMessage()); // 커뮤니티 대댓글 수정 기능 에러 발생
        }

    }

    // 커뮤니티 대댓글 삭제
    @DeleteMapping("/deleteReReply/{id}")
    public void deleteReReply(@PathVariable Integer id) { // 커뮤니티 대댓글 삭제 (DetailPost.js 에서 받는 폼 데이터)

        try {
            communityService.deleteReReply(id); // 커뮤니티 서비스 객체로 커뮤니티 대댓글 삭제 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 대댓글 삭제 : " + e.getMessage()); // 커뮤니티 대댓글 삭제 기능 에러 발생
        }

    }

}

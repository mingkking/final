package com.example.community.controller;

import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.example.community.domain.CommunityVO;
import com.example.community.domain.UserLikeVO;
import com.example.community.service.CommunityService;

@RestController
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommunityController {
    // 파일 업로드를 위한 기본 폴더 경로
    private static final String UPLOADED_FOLDER = System.getProperty("user.dir") + "/backend/SpringBoot/src/main/resources/static/uploads/";

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
    public Integer updateCommunity(@RequestBody CommunityVO communityVO) { // 커뮤니티 글 수정 (DetailPost.js 에서 받는 폼 데이터)
        System.out.println(communityVO.toString());

        try {
            communityService.updateCommunity(communityVO); // 커뮤니티 서비스 객체로 커뮤니티 글 수정 기능 실행
        } catch (Exception e) {
            System.out.println("커뮤니티 글 수정 : " + e.getMessage()); // 커뮤니티 글 수정 기능 에러 발생
        }

        return communityVO.getId();
    }

    @DeleteMapping("/deleteCommunity/{id}")
    public void deleteCommunity(@PathVariable Integer id) { // 커뮤니티 글 삭제 (DetailPost.js 에서 받는 폼 데이터)

        try {
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

}

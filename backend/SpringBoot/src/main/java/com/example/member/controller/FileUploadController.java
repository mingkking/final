package com.example.member.controller;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.member.domain.LoginVO;
import com.example.member.domain.ProfileDTO;
import com.example.member.repository.LoginRepository;

@RestController
@RequestMapping("/api")
public class FileUploadController {

    // 파일 업로드를 위한 기본 폴더 경로
    private static final String UPLOADED_FOLDER = System.getProperty("user.dir")+"/uploads/";

    @Autowired
    private LoginRepository repo;

   
    @PostMapping("/update-profile-image")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("userId") String userId) {
    	 System.out.println("Received userId: " + userId);
    	
    	// 파일이 비어있는 경우
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일을 선택해 주세요!");
        }

        try {
            // 업로드 폴더가 존재하지 않으면 생성
        	  File directory = new File(UPLOADED_FOLDER);
        	  
              if (!directory.exists()) {
                  boolean created = directory.mkdirs();
                  if (created) {
                      System.out.println("Uploads folder created successfully.");
                  } else {
                      System.out.println("Failed to create uploads folder.");
                      return ResponseEntity.status(500).body("업로드 폴더 생성에 실패했습니다.");
                  }
              } else {
                  System.out.println("Uploads folder already exists.");
                  
              }

            // 파일 이름에 UUID를 추가하여 충돌 방지
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get(UPLOADED_FOLDER + fileName);

            // 파일을 지정된 경로에 저장
            Files.write(path, file.getBytes());

            // 사용자 정보 조회
            LoginVO user = repo.findByUserId(userId);
            if (user == null) {
                return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다!");
            }

            // 기존에 프로필 이미지가 있으면 삭제
            if (user.getProfileImageUrl() != null) {
                File oldFile = new File(UPLOADED_FOLDER + user.getProfileImageUrl());
                if (oldFile.exists()) {
                    oldFile.delete();
                }
            }

            // 새로운 파일 URL 생성 및 사용자 정보 업데이트
            String fileUrl = "/images/" + fileName;
            user.setProfileImageUrl(fileUrl);
            repo.save(user);

            // ProfileDTO로 URL 반환
            return ResponseEntity.ok(new ProfileDTO(fileUrl));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("파일 업로드에 실패했습니다.");
        }
    }

    
    @GetMapping("/profile-image/{userId}")
    public ResponseEntity<?> getProfileImage(@PathVariable String userId) {
        // 사용자 정보 조회
        LoginVO user = repo.findByUserId(userId);
        if (user == null) {
            return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다!");
        }
        // 프로필 이미지 URL 반환
        return ResponseEntity.ok().body(new ProfileDTO(user.getProfileImageUrl()));
    }
    
    @GetMapping("/images/{fileName}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(UPLOADED_FOLDER + fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

package com.example.member.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MultipartFile;

import com.example.member.Service.LoginServiceImpl;
import com.example.member.domain.LoginVO;
import com.example.member.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LoginController {
    @Autowired
    private LoginServiceImpl loginService; 

    @Autowired
    private JwtUtil jwtUtil; 

    // 사용자 회원가입
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody LoginVO user) {
        LoginVO existingUser = loginService.findByUserId(user.getUserId()); // 사용자 ID로 기존 사용자 조회
        if (existingUser != null) {
            // 사용자 이름이 이미 존재하는 경우
            return ResponseEntity.badRequest().body("Username already exists."); 
        }
        loginService.saveUser(user); // 새 사용자 저장
        // 사용자 등록 성공
        return ResponseEntity.ok("User registered successfully."); 
    }

    // 사용자 이름 존재 여부 확인
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String userId) {
        // 사용자 이름 존재 여부 반환
        return ResponseEntity.ok(loginService.findByUserId(userId) != null); 
    }
    
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNickname(@RequestParam String nickname) {
        return ResponseEntity.ok(loginService.findByUserNickname(nickname) != null); 
    }
   
    
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login Request: " + loginRequest.getUserId() + ", " + loginRequest.getUserPass());

            if (loginRequest.getUserId() == null || loginRequest.getUserPass() == null) {
                return ResponseEntity.badRequest().body("User ID or password missing"); 
            }

            LoginVO user = loginService.findUserByUserId(loginRequest.getUserId()); // 사용자 조회

            if (user == null || !user.getUserPass().equals(loginRequest.getUserPass())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"); 
            }

            String userNickname = user.getUserNickname();           
            String accessToken = jwtUtil.generateToken(user); // 액세스 토큰 생성
            String refreshToken = jwtUtil.generateRefreshToken(user); // 리프레시 토큰 생성
            String refreshTokenSignature = jwtUtil.extractRefreshTokenSignature(refreshToken); // 리프레시 토큰 서명 추출

            System.out.println("accessToken: "+accessToken);
            System.out.println("refreshToken: "+refreshToken);
            user.setRefreshToken(refreshTokenSignature); // 사용자 객체에 리프레시 토큰 저장
            loginService.saveUser(user); // 업데이트된 사용자 저장

            ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken) // 액세스 토큰을 쿠키에 저장
                    .httpOnly(false) // 자바스크립트에서 접근 가능
                    .secure(false) // HTTPS에서만 전송
                    .path("/") // 전체 경로에서 유효
                    .maxAge(Duration.ofDays(7)) // 7일 동안 유효
                    .sameSite("Lax") // SameSite 속성 설정
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString()) // 쿠키를 응답 헤더에 추가
                    .body(new LoginResponse(accessToken, refreshToken, user.getUserNickname(),user.getUserId(), user.getProfileImageUrl())); 
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage()); 
        }
    }

    // 리프레시 토큰 재발급
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null || refreshToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Refresh token is missing"); 
        }

        if (jwtUtil.isValidRefreshToken(refreshToken)) { // 리프레시 토큰 유효성 검사
            String userId = jwtUtil.extractUsername(refreshToken); // 리프레시 토큰에서 사용자 ID 추출
            LoginVO user = loginService.findUserByUserId(userId); // 사용자 조회

            if (user != null && refreshToken.equals(user.getRefreshToken())) { // 리프레시 토큰이 사용자 정보와 일치하는지 확인
                String newAccessToken = jwtUtil.generateToken(user); // 새로운 액세스 토큰 생성
                String newRefreshToken = jwtUtil.generateRefreshToken(user); // 새로운 리프레시 토큰 생성

                user.setRefreshToken(jwtUtil.extractRefreshTokenSignature(newRefreshToken)); // 새로운 리프레시 토큰 서명 저장
                loginService.saveUser(user); // 업데이트된 사용자 저장
 
                return ResponseEntity.ok(new LoginResponse(newAccessToken, newRefreshToken, user.getUserNickname(), user.getUserId(), user.getProfileImageUrl())); 
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token"); 
    }
    
    // 로그인 상태 확인
    @GetMapping("/check-login-status")
    public ResponseEntity<Map<String, Object>> checkLoginStatus(@CookieValue(name = "accessToken", required = false) String accessToken) {
        Map<String, Object> response = new HashMap<>();
        if (accessToken != null && jwtUtil.isValidToken(accessToken)) { // 액세스 토큰 유효성 검사
            String userId = jwtUtil.extractUserIdFromAccessToken(accessToken); // 액세스 토큰에서 사용자 ID 추출
            LoginVO user = loginService.findUserByUserId(userId); // 사용자 조회

            if (user != null) {
                response.put("isLoggedIn", true);
                response.put("userNickname", user.getUserNickname());
                response.put("userNum", user.getUserNum());
            } else {
                response.put("isLoggedIn", false);
            }
        } else {
            response.put("isLoggedIn", false);
        }

        return ResponseEntity.ok(response); 
    }

    // 사용자 정보 조회
    @GetMapping("/user/{userId}")
    public LoginVO getUser(@PathVariable String userId) {
        return loginService.findUserByUserId(userId); // 사용자 ID로 사용자 정보 조회
    }
    
    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            // 쿠키에서 accessToken 제거
            Cookie cookie = new Cookie("accessToken", null);
            cookie.setPath("/"); // 쿠키의 경로를 설정
            cookie.setMaxAge(0); // 쿠키 만료
            response.addCookie(cookie); // 응답에 쿠키 추가

            // 클라이언트에게 성공 응답을 보냅니다.
            responseMap.put("message", "Logged out successfully");
            return ResponseEntity.ok(responseMap); 
        } catch (Exception e) {
            
            responseMap.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap); 
        }
    }
    
    
    
    // 글로벌 예외처리
    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(MissingRequestHeaderException.class)
        public ResponseEntity<String> handleMissingRequestHeader(MissingRequestHeaderException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Required request header is missing: " + ex.getHeaderName()); 
        }
    }
    
    // 아이디 찾기
    @PostMapping("/IdFind")
    public ResponseEntity<?> findUserId(@RequestParam String email, @RequestParam String name, @RequestParam String phone) {
        String userId = loginService.findUserIdByDetails(email, name, phone);
        if (userId != null) {
            return ResponseEntity.ok(userId);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No matching user found.");
        }
    }

    // 비밀번호 찾기 인증
    @PostMapping("/PwFind")
    public ResponseEntity<Boolean> validateUserForPasswordChange(@RequestBody PwFindRequest request) {
        boolean isValidUser = loginService.findByUserEmailAndUserId(request.getEmail(), request.getUserId());
        return ResponseEntity.ok(isValidUser);
    }
    
    // 비밀번호 변경
    @PostMapping("/PwChange")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request) {
        try {
            boolean isUpdated = loginService.updatePassword(request.getUserId(), request.getOldPassword(), request.getNewPassword());
            if (isUpdated) {
                return ResponseEntity.ok("Password updated successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid old password or user ID");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }  
    
    // 프로필 수정
    @PutMapping("/user/{userId}")
    public ResponseEntity<String> updateUser(@PathVariable String userId, @RequestBody UpdateUserRequest updateUserRequest) {
        try {
            LoginVO existingUser = loginService.findUserByUserId(userId);
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"); 
            }
            
            
            if (updateUserRequest.getUserName() != null) {
                existingUser.setUserName(updateUserRequest.getUserName());
            }
            if (updateUserRequest.getUserTel() != null) {
                existingUser.setUserTel(updateUserRequest.getUserTel());
            }
            if (updateUserRequest.getUserEmail() != null) {
                existingUser.setUserEmail(updateUserRequest.getUserEmail());
            }
            if (updateUserRequest.getUserNickname() != null) {
                existingUser.setUserNickname(updateUserRequest.getUserNickname());
            }
            
            
            loginService.saveUser(existingUser); // 사용자 정보 저장
            
            return ResponseEntity.ok("User updated successfully"); 
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage()); 
        }
    }
    
    //회원탈퇴
    @PostMapping("/delete-member")
    public ResponseEntity<String> deleteMember(@RequestBody Map<String, String> request, HttpServletResponse response) {
        String userId = request.get("userId");

        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.badRequest().body("사용자 ID가 필요합니다.");
        }

        try {
            loginService.deleteUserById(userId);
            
            // 쿠키에서 accessToken 제거
            Cookie cookie = new Cookie("accessToken", null);
            cookie.setPath("/"); // 쿠키의 경로를 설정
            cookie.setMaxAge(0); // 쿠키 만료
            response.addCookie(cookie); // 응답에 쿠키 추가
            
            return ResponseEntity.ok("사용자가 성공적으로 탈퇴되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("탈퇴 처리 중 오류가 발생했습니다.");
        }
    }
    
    
    
    @Data
    static class PasswordChangeRequest {
        private String userId;
        private String oldPassword;
        private String newPassword;
    }
    
    @Data
    static class PwFindRequest {
        private String email;
        private String userId;
    }
    
    @Data
    static class ProfileImageRequest {
        private String userId;
        private String profileImageUrl;
    }
   

    @Data
    static class LoginStatusResponse {
        private boolean isLoggedIn;
        private String userNickname;

        public LoginStatusResponse(boolean isLoggedIn, String userNickname) {
            this.isLoggedIn = isLoggedIn;
            this.userNickname = userNickname;
        }
    }
    
    @Data
    static class UpdateUserRequest {
        private String userName;
        private String userTel;
        private String userEmail;
        private String userNickname;
        
    }
 
    
//------------------------------------------------
    
    
    
    
    
    
}

@Data
class LoginRequest {
    private String userId;
    private String userPass;
}

@Data
class LoginResponse {
    private String token;
    private String refreshToken;
    private String userNickname;
    private String userId;
    private String profileImageUrl;

    public LoginResponse(String token, String refreshToken, String userNickname, String userId, String profileImageUrl) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userNickname = userNickname;
        this.userId = userId;
        this.profileImageUrl = profileImageUrl;
    }
}




 




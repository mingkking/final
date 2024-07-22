package com.example.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.Service.LoginServiceImpl;
import com.example.domain.LoginVO;
import com.example.util.JwtUtil;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {
    @Autowired
    private LoginServiceImpl loginService;

    @Autowired
    private JwtUtil jwtUtil; 

 // 사용자 회원가입
    @PostMapping("/join")
    public ResponseEntity<String> join(@RequestBody LoginVO user) {
        LoginVO existingUser = loginService.findByUserId(user.getUserId());
        if (existingUser != null) {
        	// 사용자 이름이 이미 존재하는 경우
            return ResponseEntity.badRequest().body("Username already exists.");
        }
        loginService.saveUser(user);
        // 사용자 등록 성공
        return ResponseEntity.ok("User registered successfully.");
    }

 // 사용자 이름 존재 여부 확인
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsername(@RequestParam String userId) {
    	// 사용자 이름 존재 여부 반환
        return ResponseEntity.ok(loginService.findByUserId(userId) != null);
    }
    
    // 로그인
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login Request: " + loginRequest.getUserId() + ", " + loginRequest.getUserPass());

            if (loginRequest.getUserId() == null || loginRequest.getUserPass() == null) {
                return ResponseEntity.badRequest().body("User ID or password missing");
            }

            LoginVO user = loginService.findUserByUserId(loginRequest.getUserId());

            if (user == null || !user.getUserPass().equals(loginRequest.getUserPass())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }

            String userNickname = user.getUserNickname();           
            String accessToken = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);
            String refreshTokenSignature = jwtUtil.extractRefreshTokenSignature(refreshToken);

            System.out.println("accessToken: "+accessToken);
            System.out.println("refreshToken: "+refreshToken);
            user.setRefreshToken(refreshTokenSignature);
            loginService.saveUser(user);

            ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(Duration.ofDays(7))
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new LoginResponse(accessToken, refreshToken, user.getUserNickname()));
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

        if (jwtUtil.isValidRefreshToken(refreshToken)) {
            String userId = jwtUtil.extractUsername(refreshToken);
            LoginVO user = loginService.findUserByUserId(userId);

            if (user != null && refreshToken.equals(user.getRefreshToken())) {
                String newAccessToken = jwtUtil.generateToken(user);
                String newRefreshToken = jwtUtil.generateRefreshToken(user);

                user.setRefreshToken(jwtUtil.extractRefreshTokenSignature(newRefreshToken));
                loginService.saveUser(user);
 
                return ResponseEntity.ok(new LoginResponse(newAccessToken, newRefreshToken, user.getUserNickname()));
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
    }
    
    

       
    

    // 로그인 상태 확인
    @GetMapping("/check-login-status")
    public ResponseEntity<Map<String, Object>> checkLoginStatus(@CookieValue(name = "accessToken", required = false) String accessToken) {
        Map<String, Object> response = new HashMap<>();
        if (accessToken != null && jwtUtil.isValidToken(accessToken)) {
            String userId = jwtUtil.extractUserIdFromAccessToken(accessToken);
            LoginVO user = loginService.findUserByUserId(userId);

            if (user != null) {
                response.put("isLoggedIn", true);
                response.put("userNickname", user.getUserNickname());
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
        return loginService.findUserByUserId(userId);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletResponse response) {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            // 쿠키에서 accessToken 제거
            Cookie cookie = new Cookie("accessToken", null);
            cookie.setPath("/"); // 쿠키의 경로를 설정
            cookie.setMaxAge(0); // 쿠키 만료
            response.addCookie(cookie);

            // 클라이언트에게 성공 응답을 보냅니다.
            responseMap.put("message", "Logged out successfully");
            return ResponseEntity.ok(responseMap);
        } catch (Exception e) {
            // 에러 발생 시, 에러 메시지를 응답으로 보냅니다.
            responseMap.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }
    
    //글로벌 예외처리
    @RestControllerAdvice
    public class GlobalExceptionHandler {

        @ExceptionHandler(MissingRequestHeaderException.class)
        public ResponseEntity<String> handleMissingRequestHeader(MissingRequestHeaderException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Required request header is missing: " + ex.getHeaderName());
        }

        
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

    public LoginResponse(String token, String refreshToken, String userNickname) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.userNickname = userNickname;
    }
}




 




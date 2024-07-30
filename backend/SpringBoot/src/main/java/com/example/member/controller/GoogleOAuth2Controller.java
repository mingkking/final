package com.example.member.controller;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.persistence.Column;

import com.example.member.Service.LoginServiceImpl;
import com.example.member.domain.LoginVO;
import com.example.member.util.JwtUtil;

import lombok.Data;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class GoogleOAuth2Controller {
 
    @Autowired
    private LoginServiceImpl loginService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private WebClient.Builder webClientBuilder;

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> payload) {
        try {
        	
        	 String idToken = payload.get("idToken");
        	 System.out.println("Received ID Token: " + idToken);
             
            // Google의 공개키를 이용해 idToken 검증
            GoogleUserInfo googleUserInfo = getGoogleUserInfo(idToken);

            // 구글 사용자 정보로 사용자 조회
            LoginVO user = loginService.findUserByUserId(googleUserInfo.getUserId());
            System.out.println("Google User Info: " + googleUserInfo);

            if (user == null) {
                // 새 사용자 등록
                user = new LoginVO();
                user.setUserId(googleUserInfo.getUserId());
                user.setUserNickname(googleUserInfo.getUserNickname());
                user.setUserEmail(googleUserInfo.getUserEmail());
                user.setUserName(googleUserInfo.getUserName());
                user.setUserPass("0"); // Google OAuth2 사용자에 대해 빈 문자열로 설정
                user.setUserTel("0");  // Google OAuth2 사용자에 대해 빈 문자열로 설정
                user.setProfileImageUrl(googleUserInfo.getProfileImageUrl());
                loginService.saveUser(user);
            }

            // JWT 생성
            String accessToken = jwtUtil.generateToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);
            String refreshTokenSignature = jwtUtil.extractRefreshTokenSignature(refreshToken); // 리프레시 토큰 서명 추출

            user.setRefreshToken(refreshTokenSignature);
            System.out.println("리프레시 토큰 : "+refreshTokenSignature);
            loginService.saveUser(user);
            // 쿠키 설정
            ResponseCookie cookie = ResponseCookie.from("accessToken", accessToken) 
                    .httpOnly(false) // 자바스크립트에서 접근 불가
                    .secure(false) // HTTPS에서만 전송
                    .path("/") 
                    .maxAge(Duration.ofDays(7)) 
                    .sameSite("Lax") 
                    .build();

            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", accessToken);
            response.put("refreshToken", refreshToken);
            response.put("userNickname", user.getUserNickname());
            response.put("userId", user.getUserId());
            response.put("profileImageUrl", user.getProfileImageUrl());
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(response);
        } catch (Exception e) {
        	 e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google login failed: " + e.getMessage());
        }
    }

    private GoogleUserInfo getGoogleUserInfo(String idToken) throws Exception {
        String url = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + idToken;
        WebClient webClient = webClientBuilder.build();

        String response = webClient.get()
            .uri(url)
            .retrieve()
            .onStatus(status -> status.value() >= 400, 
                clientResponse -> 
                    clientResponse.bodyToMono(String.class)
                        .flatMap(errorBody -> {
                            // 오류 메시지를 포함하여 예외를 발생시킵니다.
                            return Mono.error(new RuntimeException("Failed to get user info from Google: " + errorBody));
                        })
            )
            .bodyToMono(String.class)
            .block();

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(response);

        if (jsonNode.has("error_description")) {
            throw new RuntimeException("Google API error: " + jsonNode.get("error_description").asText());
        }

        GoogleUserInfo userInfo = new GoogleUserInfo();
        userInfo.setUserId(jsonNode.get("sub").asText());
        userInfo.setUserNickname(jsonNode.get("name").asText());
        userInfo.setUserEmail(jsonNode.get("email").asText());
        userInfo.setUserName(jsonNode.get("name").asText());

     // 구글에서 프로필 이미지 URL 가져오기 (기본 프로필 이미지 사용 가능)
        userInfo.setProfileImageUrl(jsonNode.has("picture") ? jsonNode.get("picture").asText() : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
        
        return userInfo;
    }

    @Data
    static class GoogleUserInfo {
        private String userId;
        private String userNickname;
        private String userEmail;
        private String userName;
        private String profileImageUrl;
        
        @Column(nullable = true)
        private String userPass;
        @Column(nullable = true)
        private String userTel;
    }
}
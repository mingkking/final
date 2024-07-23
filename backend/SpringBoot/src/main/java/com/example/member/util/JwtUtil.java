package com.example.util;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date; 
import com.example.domain.LoginVO;


import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUtil {

    private final Key secretKey;
    private final Key refreshKey;

    //생성자 키 초기화
    public JwtUtil(@Value("${jwt.secret.key}") String secret) {
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT secret key is not set in application.properties"); // 비밀 키가 설정되지 않은 경우 예외 발생
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());  // 액세스 토큰 서명 키 설정
        this.refreshKey = Keys.hmacShaKeyFor(secret.getBytes()); // 리프레시 토큰 서명 키 설정
    }

 // 액세스 토큰 생성
    public String generateToken(LoginVO user) {
        return Jwts.builder()
                .setSubject(user.getUserId()) // 토큰의 주제(subject)에 사용자 ID 설정
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 토큰 만료 시간 설정 (1시간)
                .signWith(secretKey, SignatureAlgorithm.HS256) // 비밀 키와 서명 알고리즘 설정
                .compact(); // 토큰 생성
    }

    // 리프레시 토큰 생성
    public String generateRefreshToken(LoginVO user) {
        return Jwts.builder()
                .setSubject(user.getUserId()) // 토큰의 주제(subject)에 사용자 ID 설정
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 토큰 만료 시간 설정 (7일)
                .signWith(refreshKey, SignatureAlgorithm.HS256) // 비밀 키와 서명 알고리즘 설정
                .compact(); // 토큰 생성
    }

    // JWT의 서명 부분만 추출
    public String extractRefreshTokenSignature(String refreshToken) {
        return refreshToken.split("\\.")[2]; 
    }

    // 토큰의 클레임 추출
    public Claims extractClaims(String token, Key key) {
        return Jwts.parserBuilder()
                .setSigningKey(key) // 서명 키 설정
                .build()
                .parseClaimsJws(token) // JWT 파싱
                .getBody(); // 클레임 추출
    }

    // secretKey를 사용하여 토큰의 클레임 추출
    public Claims extractClaims(String token) {
        return extractClaims(token, secretKey); // 기본 서명 키로 클레임 추출
    }

    // 토큰에서 사용자 이름(Username) 추출
    public String extractUsername(String token) {
        return extractClaims(token).getSubject(); // 클레임에서 사용자 ID(Username) 추출
    }
    
    // 토큰에서 아이디 추출
    public String extractUserIdFromAccessToken(String token) {
        Claims claims = Jwts.parser()
                            .setSigningKey(secretKey) // 서명 키 설정
                            .parseClaimsJws(token) // JWT 파싱
                            .getBody(); // 클레임 추출
        return claims.getSubject();  // 사용자 ID 반환
    }


    // 토큰이 만료되었는지 확인
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date()); // 현재 날짜와 비교하여 만료 여부 확인
    }
    
    // 토큰의 유효성 검사
    public boolean isValidToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token); // JWT 파싱
            return true; // 토큰 유효
        } catch (JwtException | IllegalArgumentException e) {
            return false; // 토큰 유효하지 않음
        }
    }

    // 리프레시 토큰이 유효한지 확인
    public boolean isValidRefreshToken(String token) {
        try {
        	
            Claims claims = extractClaims(token, refreshKey);  // 리프레시 토큰의 클레임 추출
            return !claims.getExpiration().before(new Date()); // 만료 여부 확인
        } catch (JwtException e) {
            log.error("Refresh Token is invalid or expired", e);
            return false; // 리프레시 토큰 유효하지 않음
        }
    }

    // 주어진 토큰이 유효하고, 사용자 정보와 일치하는지 확인
    public boolean validateToken(String token, LoginVO user) {
        return (user.getUserId().equals(extractUsername(token)) && !isTokenExpired(token)); // 사용자 ID와 토큰 만료 여부 확인
    }
}

package com.example.member.util;



import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date; 
import com.example.member.domain.LoginVO;


import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class JwtUtil {

    private final Key secretKey;
    private final Key refreshKey;

    //생성자 키 초기화
    public JwtUtil(@Value("${jwt.secret.key}") String secret) {
        if (secret == null || secret.isEmpty()) {
            throw new IllegalStateException("JWT secret key is not set in application.properties");
        }
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.refreshKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // 에세스 토큰 생성
    public String generateToken(LoginVO user) {
        return Jwts.builder()
                .setSubject(user.getUserId())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1시간
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // 리프레시 토큰 생성
    public String generateRefreshToken(LoginVO user) {
        return Jwts.builder()
                .setSubject(user.getUserId())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 7)) // 7일
                .signWith(refreshKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT의 서명 부분만 추출
    public String extractRefreshTokenSignature(String refreshToken) {
        return refreshToken.split("\\.")[2]; 
    }

    // 토큰의 클레임 추출
    public Claims extractClaims(String token, Key key) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // secretKey를 사용하여 토큰의 클레임 추출
    public Claims extractClaims(String token) {
        return extractClaims(token, secretKey);
    }

    // 토큰에서 사용자 이름(Username) 추출
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }
    
    // 토큰에서 아이디 추출
    public String extractUserIdFromAccessToken(String token) {
        Claims claims = Jwts.parser()
                            .setSigningKey(secretKey)
                            .parseClaimsJws(token)
                            .getBody();
        return claims.getSubject(); 
    }


    // 토큰이 만료되었는지 확인
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
    
    public boolean isValidToken(String token) {
        try {
            Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 리프레시 토큰이 유효한지 확인
    public boolean isValidRefreshToken(String token) {
        try {
        	
            Claims claims = extractClaims(token, refreshKey);
            return !claims.getExpiration().before(new Date());
        } catch (JwtException e) {
            log.error("Refresh Token is invalid or expired", e);
            return false;
        }
    }

    // 주어진 토큰이 유효하고, 사용자 정보와 일치하는지 확인
    public boolean validateToken(String token, LoginVO user) {
        return (user.getUserId().equals(extractUsername(token)) && !isTokenExpired(token));
    }
}

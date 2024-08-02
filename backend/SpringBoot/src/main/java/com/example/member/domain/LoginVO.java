package com.example.member.domain;

import java.time.LocalDateTime;
import java.util.List;

import com.example.community.domain.CommunityVO;

import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity 
@Table(name = "users")
public class LoginVO {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_seq", allocationSize = 1)
    private Integer userNum;	
	@Column(name = "user_name", length = 50, nullable = false)
    private String userName;  // 사용자 이름 (길이 50자, NOT NULL)
    @Column(name = "user_id", length = 50, unique = true, nullable = false)
    private String userId;    // 사용자 아이디 (길이 20자, 유니크, NOT NULL)
    @Column(name = "user_pass", length = 100, nullable = true)
    private String userPass;  // 비밀번호 (길이 100자, NOT NULL)
    @Column(name = "user_tel", length = 15, nullable = true)
    private String userTel;   // 전화번호 (길이 15자, NOT NULL)
    @Column(name = "user_email", length = 50, unique = true, nullable = false)
    private String userEmail; // 이메일 (길이 50자, 유니크, NOT NULL)
    @Column(name = "user_nickname", length = 30, unique = true, nullable = false)
    private String userNickname; // 닉네임 (길이 30자, 유니크, NOT NULL)
    @Column(name = "user_birthdate", length = 6, nullable = false)
    private String userBirthdate; // 생년월일
    @Column(name = "refresh_token", length = 255)
    private String refreshToken;  // 리프레시 토큰 (길이 255자)
    @Column(name = "profile_image_url", length = 255)
    private String profileImageUrl;  // 프로필 사진 URL (길이 255자)
    @Column(name = "created_at")
    private LocalDateTime createdAt;  // 생성일
    
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        System.out.println("Setting createdAt: " + this.createdAt);
    }
    
    
    
    
	
} 

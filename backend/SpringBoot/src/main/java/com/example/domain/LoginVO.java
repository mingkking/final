package com.example.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    @Column(name = "user_id", length = 20, unique = true, nullable = false)
    private String userId;    // 사용자 아이디 (길이 20자, 유니크, NOT NULL)
    @Column(name = "user_pass", length = 100, nullable = false)
    private String userPass;  // 비밀번호 (길이 100자, NOT NULL)
    @Column(name = "user_tel", length = 15, nullable = false)
    private String userTel;   // 전화번호 (길이 15자, NOT NULL)
    @Column(name = "user_email", length = 50, unique = true, nullable = false)
    private String userEmail; // 이메일 (길이 50자, 유니크, NOT NULL)
    @Column(name = "user_nickname", length = 30, unique = true, nullable = false)
    private String userNickname; // 닉네임 (길이 30자, 유니크, NOT NULL)
    @Column(name = "refresh_token", length = 255)
    private String refreshToken;  // 리프레시 토큰 (길이 255자)
    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private String created_at;  // 생성일 (기본값: 현재 시간)
	
}

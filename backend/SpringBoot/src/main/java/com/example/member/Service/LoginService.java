package com.example.member.Service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.member.domain.LoginVO;

public interface LoginService {
    LoginVO findUserByUserId(String userId);
    LoginVO saveUser(LoginVO user);
    void deleteRefreshToken(String userId);
}
 
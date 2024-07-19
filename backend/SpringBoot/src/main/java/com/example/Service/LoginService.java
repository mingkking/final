package com.example.Service;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.LoginVO;

public interface LoginService {
    LoginVO findUserByUserId(String userId);
    LoginVO saveUser(LoginVO user);
    void deleteRefreshToken(String userId);
}

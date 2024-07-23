package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.LoginVO;

public interface LoginRepository extends JpaRepository<LoginVO, Integer> {
    LoginVO findByUserId(String userId);
    LoginVO findByUserEmailAndUserNameAndUserTel(String userEmail, String userName, String userTel);
    LoginVO findByUserEmailAndUserId(String userEmail, String userId);
}        
 
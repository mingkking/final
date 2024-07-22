package com.example.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.domain.LoginVO;

public interface LoginRepository extends JpaRepository<LoginVO, Integer> {
    LoginVO findByUserId(String userId);
}
 
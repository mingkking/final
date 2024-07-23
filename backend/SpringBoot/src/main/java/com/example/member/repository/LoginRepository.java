package com.example.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.member.domain.LoginVO;

public interface LoginRepository extends JpaRepository<LoginVO, Integer> {
    LoginVO findByUserId(String userId);
}
 
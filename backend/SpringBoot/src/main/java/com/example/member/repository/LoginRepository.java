package com.example.member.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.member.domain.LoginVO;

@Repository
public interface LoginRepository extends JpaRepository<LoginVO, Integer> {
    LoginVO findByUserId(String userId);
    LoginVO findByUserEmailAndUserNameAndUserTel(String userEmail, String userName, String userTel);
    LoginVO findByUserEmailAndUserId(String userEmail, String userId);
    LoginVO findByUserNickname(String userNickname);
    LoginVO findByUserEmail(String userEmail);
    LoginVO findByUserTel(String userTel);
    

}        
 
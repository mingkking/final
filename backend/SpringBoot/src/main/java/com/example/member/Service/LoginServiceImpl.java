package com.example.member.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.member.domain.LoginVO;
import com.example.member.repository.LoginRepository;

@Service
public class LoginServiceImpl {

    @Autowired 
    private LoginRepository repo;

    // 사용자 ID로 사용자 조회
    public LoginVO findUserByUserId(String userId) {
        return repo.findByUserId(userId); // 사용자 ID로 사용자 정보 조회
    }  
    
    public LoginVO findByUserId(String userId) {
        return repo.findByUserId(userId);
    }
    
    // 회원가입
    public LoginVO saveUser(LoginVO user) {
    	System.out.println("Saving user: " + user);
        return repo.save(user); // 사용자 정보 저장
    }
    
    // 리프레시 토큰 삭제
    public void deleteRefreshToken(String userId) {
        LoginVO user = findUserByUserId(userId); // 사용자 ID로 사용자 정보 조회
        if (user != null) {
            user.setRefreshToken(null); // 리프레시 토큰 삭제
            saveUser(user); // 업데이트된 사용자 저장
        }
    }
    
    // 새로운 RefreshToken 저장
    public void saveRefreshToken(String userId, String refreshToken) {
        LoginVO user = findUserByUserId(userId); // 사용자 ID로 사용자 정보 조회
        if (user != null) {
            user.setRefreshToken(refreshToken); // 새로운 리프레시 토큰 저장
            saveUser(user);  // 업데이트된 사용자 저장
        }
    }

    // RefreshToken 가져오기
    public String getRefreshToken(String userId) {
        LoginVO user = findUserByUserId(userId); // 사용자 ID로 사용자 정보 조회
        if (user != null) {
            return user.getRefreshToken(); // 리프레시 토큰 반환
        }
        return null; // 리프레시 토큰이 없으면 null 반환
    }
    
    // 아이디 찾기
    public String findUserIdByDetails(String email, String name, String phone) {
        LoginVO user = repo.findByUserEmailAndUserNameAndUserTel(email, name, phone);
        if (user != null) {
            return user.getUserId(); // 사용자 아이디 반환
        }
        return null;
    } 
    
    // 닉네임으로 사용자 조회
    public LoginVO findByUserNickname(String userNickname) {
        return repo.findByUserNickname(userNickname);
    }
    
    // 비밀번호 찾기 인증
    public boolean findByUserEmailAndUserId(String email, String userId) {
        LoginVO user = repo.findByUserEmailAndUserId(email, userId);
        return user != null; // 사용자 인증 성공 여부 반환
    }
    
    // 비밀번호 변경
    public boolean updatePassword(String userId, String oldPassword, String newPassword) {
        LoginVO user = repo.findByUserId(userId);

        if (user != null && user.getUserPass().equals(oldPassword)) {  // 기존 비밀번호 확인
            user.setUserPass(newPassword); // 비밀번호 변경
            repo.save(user); // 업데이트된 사용자 저장
            return true; // 비밀번호 변경 성공
        }
        return false; // 비밀번호 변경 실패
    }
    
    
   
}

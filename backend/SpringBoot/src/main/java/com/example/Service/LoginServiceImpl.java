package com.example.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.domain.LoginVO;
import com.example.repository.LoginRepository;

@Service
public class LoginServiceImpl {

    @Autowired 
    private LoginRepository repo;

     
    public LoginVO findUserByUserId(String userId) {
        return repo.findByUserId(userId);
    }
    
    public LoginVO findByUserId(String userId) {
        return repo.findByUserId(userId);
    }
    
    
    public LoginVO saveUser(LoginVO user) {
    	System.out.println("Saving user: " + user);
        return repo.save(user);
    }
    
   
    public void deleteRefreshToken(String userId) {
        LoginVO user = findUserByUserId(userId);
        if (user != null) {
            user.setRefreshToken(null);
            saveUser(user);
        }
    }
    
    // 새로운 RefreshToken 저장
    public void saveRefreshToken(String userId, String refreshToken) {
        LoginVO user = findUserByUserId(userId);
        if (user != null) {
            user.setRefreshToken(refreshToken);
            saveUser(user);
        }
    }

    // RefreshToken 가져오기
    public String getRefreshToken(String userId) {
        LoginVO user = findUserByUserId(userId);
        if (user != null) {
            return user.getRefreshToken();
        }
        return null;
    }
}

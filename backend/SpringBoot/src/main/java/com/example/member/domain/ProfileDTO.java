package com.example.member.domain;


public class ProfileDTO {

	 // 프로필 이미지 URL
    private String profileImageUrl;
    private String userNickname;
    private String userId;

    // 생성자
    public ProfileDTO(String profileImageUrl, String userNickname, String userId) {
        this.profileImageUrl = profileImageUrl;
        this.userNickname = userNickname;
        this.userId = userId;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    public String getUserNickname() {
        return userNickname;
    }

    public void setUserNickname(String userNickname) {
        this.userNickname = userNickname;
    }
    
    public String getUserId() {
        return userId; 
    }

    public void setUserId(String userId) {
        this.userId = userId; 
    }
    
}

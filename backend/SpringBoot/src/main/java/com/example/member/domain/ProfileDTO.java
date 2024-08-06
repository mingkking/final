package com.example.member.domain;


public class ProfileDTO {

	 // 프로필 이미지 URL
    private String profileImageUrl;
    private String userNickname;

    // 생성자
    public ProfileDTO(String profileImageUrl, String userNickname) {
        this.profileImageUrl = profileImageUrl;
        this.userNickname = userNickname;
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
    
}

package com.example.member.domain;


public class ProfileDTO {

	 // 프로필 이미지 URL
    private String profileImageUrl;

    // 생성자
    public ProfileDTO(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
    
}

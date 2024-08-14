package com.example.mgr.domain;

import lombok.Data;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "rooms")
public class MgrChatVO {
    @Id
    private String id;
    private String room; // 채팅방 이름
    private Date createdAt; // 생성 일자
    private List<String> members; // 멤버인데 66bb07f1c04960347946f3e5 이런식이라 누군지 모름
    private int chat_num;

    
    // 멤버 수 구하는 함수
    public int membersCount() {
    	return members != null ? members.size() : 0;
    }
    
    // chat_num 값을 설정하는 메서드
    public void setChatNum(int chat_num) {
        this.chat_num = chat_num;
    }
}

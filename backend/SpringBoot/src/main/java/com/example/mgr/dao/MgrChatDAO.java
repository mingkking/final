package com.example.mgr.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.example.mgr.domain.MgrChatVO;

@Repository
public class MgrChatDAO {

    @Autowired
    private MongoTemplate mongoTemplate;

    // rooms 컬렉션의 문서 수를 계산하는 메소드
    public long countRooms() {
        Query query = new Query();
        return mongoTemplate.count(query, "rooms");
    }
    
    // rooms 컬렉션의 모든 문서를 조회하는 메소드
    public List<MgrChatVO> findAllRooms() {
        Query query = new Query();
        return mongoTemplate.find(query, MgrChatVO.class, "rooms");
    }
}

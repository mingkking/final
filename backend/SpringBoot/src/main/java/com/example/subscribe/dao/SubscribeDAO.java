package com.example.subscribe.dao;
   
import org.apache.ibatis.annotations.Mapper;

import com.example.subscribe.domain.SubscribeVO;


@Mapper 
public interface SubscribeDAO {

	// 구독 결제 시 데이터 저장
	public void insertSubscriber(SubscribeVO vo);
	
	// 구독 중복 체크
	public int selectSubscriber(SubscribeVO vo);
	
}
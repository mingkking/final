package com.example.subscribe.Service;

import com.example.subscribe.domain.SubscribeVO;
 
public interface SubscribeService {
	 
	// 구독 결제 시 데이터 저장
	void insertSubscriber(SubscribeVO vo);
	
	// 구독 중복 체크
	int selectSubscriber(SubscribeVO vo);
	
	// 구독 날짜 체크
	String selectSubscribeDate(SubscribeVO vo);
}

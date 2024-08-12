package com.example.subscribe.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.subscribe.dao.SubscribeDAO;
import com.example.subscribe.domain.SubscribeVO;
 
@Service
public class SubscribeServiceImpl implements SubscribeService {
	 
	@Autowired
	private SubscribeDAO subscribeDAO;

	// 구독 결제 시 데이터 저장
	public void insertSubscriber(SubscribeVO vo) {
		subscribeDAO.insertSubscriber(vo);
	}

	// 구독 중복 체크
	public int selectSubscriber(SubscribeVO vo) {
		int result = subscribeDAO.selectSubscriber(vo);
		return result;
	}

	// 구독 날짜 체크
	public String selectSubscribeDate(SubscribeVO vo) {
		String date = subscribeDAO.selectSubscribeDate(vo);
		return date;
	} 


}

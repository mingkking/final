package com.example.test.Service;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.test.domain.CountVO;

public interface CountService {
	
	// session 값 저장
	int saveSession(CountVO vo);
	
	// 방문자 수 count
	int selectTotalSession();
	int selectTodaySession();
	int selectMonthSession();
	
	// 회원 수 count
	int selectTotalMembers();
	
	// 구독자 수 count
	int selectTotalSubscribers();
}

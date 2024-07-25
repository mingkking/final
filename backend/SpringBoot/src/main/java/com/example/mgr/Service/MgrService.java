package com.example.mgr.Service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
  
public interface MgrService {
	 
	// session 값 저장
	int saveSession(MgrSessionCountVO vo);
	 
	// 방문자 수 count
	int selectTotalSession();
	int selectTodaySession();
	int selectMonthSession();
	
	// 회원 수 count
	int selectTotalMembers();
	int selectTodayMembers();
	
	// 구독자 수 count
	int selectTotalSubscribers();
	
	// 회원 목록
	List<MgrMemberVO> selectMembers(MgrMemberVO vo);
	
	// 회원 상세 목록
	List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo);
}

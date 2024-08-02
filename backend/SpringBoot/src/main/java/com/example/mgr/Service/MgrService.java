package com.example.mgr.Service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
import com.example.mgr.domain.MgrCommunityVO;
   
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
	
	// 최근 5일/5달간 가입자 수
	List<Map<String, Object>> selectLast5DaysMember();
	List<Map<String, Object>> selectLast5MonthsMember();
	List<Map<String, Object>> selectLast2YearsMember();
	
	// 구독자 수 count
	int selectTotalSubscribers();
	int selectTodaySubscribers();
	
	// 회원 연령대
	List<Map<String, Object>> countByAgeMember();
	
	// 회원 목록
	List<MgrMemberVO> selectMembers(MgrMemberVO vo);
	
	// 회원 상세 목록
	List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo);
	
	// 회원 상세 목록 페이지의 커뮤니티 정보
	List<MgrCommunityVO> selectCommPost(MgrCommunityVO vo);
	
	// 회원 삭제
	void deleteMember(int user_num);
	
	// 회원 수정
	int updateMember(MgrMemberVO vo);
}

package com.example.mgr.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.mgr.dao.MgrDAO;
import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
  
@Service
public class MgrServiceImpl implements MgrService {
	 
	@Autowired
	private MgrDAO mgrDAO; 

	// 세션 값 저장
	public int saveSession(MgrSessionCountVO vo) {
		int result = mgrDAO.saveSession(vo);
		return result;
	}

	// 총 방문자 수
	public int selectTotalSession() {
		return mgrDAO.selectTotalSession();
	}

	// 금일 방문자 수
	public int selectTodaySession() {
		return mgrDAO.selectTodaySession();
	}

	// 한달 방문자 수
	public int selectMonthSession() {
		return mgrDAO.selectMonthSession();
	}

	// 총 회원 수
	public int selectTotalMembers() {
		return mgrDAO.selectTotalMembers();
	}

	// 총 구독자 수
	public int selectTotalSubscribers() {
		return mgrDAO.selectTotalSubscribers();
	}
	
	// 금일 구독자 수
	public int selectTodaySubscribers() {
		return mgrDAO.selectTodaySubscribers();
	}

	// 금일 가입자 수
	public int selectTodayMembers() {
		return mgrDAO.selectTodayMembers();
	}

	// 회원 목록
	public List<MgrMemberVO> selectMembers(MgrMemberVO vo) {
		return mgrDAO.selectMembers(vo);
	}

	// 회원 상세 목록
	public List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo) {
		return mgrDAO.selectMemberDetail(vo);
	}

	// 회원 삭제
	public void deleteMember(int user_num) {
		mgrDAO.deleteMember(user_num);
	}

	// 최근 5일간 가입자 수
	public List<Map<String, Object>> selectLast5DaysMember() {
		return mgrDAO.selectLast5DaysMember();
	}

	// 최근 5달간 가입자 수
	public List<Map<String, Object>> selectLast5MonthsMember() {
		return mgrDAO.selectLast5MonthsMember();
	}

	// 최근 2년간 가입자 수
	public List<Map<String, Object>> selectLast2YearsMember() {
		return mgrDAO.selectLast2YearsMember();
	}

	// 회원 연령대
	public List<Map<String, Object>> countByAgeMember() {
		return mgrDAO.countByAgeMember();
	}


}

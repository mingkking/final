package com.example.mgr.dao;
   
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.example.mgr.domain.MgrCommunityVO;
import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;

@Mapper  
public interface MgrDAO {
	
	// session 값 저장
	public int saveSession(MgrSessionCountVO vo);
	
	// 방문자 수
	public int selectTotalSession();
	public int selectTodaySession();
	public int selectMonthSession();
	
	// 회원 수
	public int selectTotalMembers();
	public int selectTodayMembers();
	public List<Map<String, Object>> selectLast5DaysMember();
	public List<Map<String, Object>> selectLast5MonthsMember();
	public List<Map<String, Object>> selectLast2YearsMember();
	
	// 구독자 수
	public int selectTotalSubscribers();
	public int selectTodaySubscribers();
	
	// 회원 연령대
	public List<Map<String, Object>> countByAgeMember();
	
	// 회원 목록
	public List<MgrMemberVO> selectMembers(MgrMemberVO vo);
	
	// 회원 상세 목록
	public List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo);
	
	// 회원 삭제
	public void deleteMember(int user_num);

	// 회원 상세 목록 페이지의 커뮤니티 정보
	public List<MgrCommunityVO> selectCommPost(MgrCommunityVO vo);
	
	// 회원 수정
	public int updateMember(MgrMemberVO vo);
}
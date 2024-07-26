package com.example.mgr.dao;
   
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;

@Mapper 
public interface MgrDAO {
	public int saveSession(MgrSessionCountVO vo);
	public int selectTotalSession();
	public int selectTodaySession();
	public int selectMonthSession();
	public int selectTotalMembers();
	public int selectTodayMembers();
	public int selectTotalSubscribers();
	
	// 회원 목록
	public List<MgrMemberVO> selectMembers(MgrMemberVO vo);
	
	// 회원 상세 목록
	public List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo);
	
	// 회원 삭제
	public void deleteMember(int user_num);
}
package com.example.mgr.Service;

import java.util.List;

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

	@Override
	public int saveSession(MgrSessionCountVO vo) {
		int result = mgrDAO.saveSession(vo);
		return result;
	}

	@Override
	public int selectTotalSession() {
		return mgrDAO.selectTotalSession();
	}

	@Override
	public int selectTodaySession() {
		return mgrDAO.selectTodaySession();
	}

	@Override
	public int selectMonthSession() {
		return mgrDAO.selectMonthSession();
	}

	@Override
	public int selectTotalMembers() {
		return mgrDAO.selectTotalMembers();
	}

	@Override
	public int selectTotalSubscribers() {
		return mgrDAO.selectTotalSubscribers();
	}

	@Override
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



	
	
}
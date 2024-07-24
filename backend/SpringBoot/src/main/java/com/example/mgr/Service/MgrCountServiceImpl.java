package com.example.mgr.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.mgr.dao.MgrCountDAO;
import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;

@Service
public class MgrCountServiceImpl implements MgrCountService {
	
	@Autowired
	private MgrCountDAO mgrcountDAO;

	@Override
	public int saveSession(MgrSessionCountVO vo) {
		int result = mgrcountDAO.saveSession(vo);
		return result;
	}

	@Override
	public int selectTotalSession() {
		return mgrcountDAO.selectTotalSession();
	}

	@Override
	public int selectTodaySession() {
		return mgrcountDAO.selectTodaySession();
	}

	@Override
	public int selectMonthSession() {
		return mgrcountDAO.selectMonthSession();
	}

	@Override
	public int selectTotalMembers() {
		return mgrcountDAO.selectTotalMembers();
	}

	@Override
	public int selectTotalSubscribers() {
		return mgrcountDAO.selectTotalSubscribers();
	}

	@Override
	public int selectTodayMembers() {
		return mgrcountDAO.selectTodayMembers();
	}

	// 회원 목록
	public List<MgrMemberVO> selectMembers(MgrMemberVO vo) {
		return mgrcountDAO.selectMembers(vo);
	}



	
	
}
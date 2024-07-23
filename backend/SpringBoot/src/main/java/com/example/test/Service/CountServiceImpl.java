package com.example.test.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.test.dao.CountDAO;
import com.example.test.domain.CountVO;

@Service
public class CountServiceImpl implements CountService {
	
	@Autowired
	private CountDAO countDAO;

	@Override
	public int saveSession(CountVO vo) {
		int result = countDAO.saveSession(vo);
		return result;
	}

	@Override
	public int selectTotalSession() {
		return countDAO.selectTotalSession();
	}

	@Override
	public int selectTodaySession() {
		return countDAO.selectTodaySession();
	}

	@Override
	public int selectMonthSession() {
		return countDAO.selectMonthSession();
	}

	@Override
	public int selectTotalMembers() {
		return countDAO.selectTotalMembers();
	}

	@Override
	public int selectTotalSubscribers() {
		return countDAO.selectTotalSubscribers();
	}



	
	
}
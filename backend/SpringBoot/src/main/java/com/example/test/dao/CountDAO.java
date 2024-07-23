package com.example.test.dao;

import org.apache.ibatis.annotations.Mapper;

import com.example.test.domain.CountVO;

@Mapper
public interface CountDAO {
	public int saveSession(CountVO vo);
	public int selectTotalSession();
	public int selectTodaySession();
	public int selectMonthSession();
	public int selectTotalMembers();
	public int selectTotalSubscribers();
}
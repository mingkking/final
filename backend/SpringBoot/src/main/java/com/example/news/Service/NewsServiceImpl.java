package com.example.news.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.news.dao.NewsDAO;
import com.example.news.domain.NewsVO;
import com.example.subscribe.dao.SubscribeDAO;
import com.example.subscribe.domain.SubscribeVO;
 
@Service
public class NewsServiceImpl implements NewsService {
	
	@Autowired
	private NewsDAO newsDAO;

	// 뉴스 데이터 중 오늘 데이터 랜덤 10개 가져오기
	public List<NewsVO> selectRecent20News(NewsVO vo) {
		return newsDAO.selectRecent20News(vo);
	}

	// 증권 뉴스 데이터
	public List<NewsVO> selectFinanceNews(NewsVO vo) {
		return newsDAO.selectFinanceNews(vo);
	}

	// 부동산 뉴스 데이터
	public List<NewsVO> selectRENews(NewsVO vo) {
		return newsDAO.selectRENews(vo);
	}

	// 경제 뉴스 데이터
	public List<NewsVO> selectEconomyNews(NewsVO vo) {
		return newsDAO.selectEconomyNews(vo);
	}
	 



}

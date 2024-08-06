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

	// 뉴스 최신 20개 값 가져오기
	public List<NewsVO> selectRecent20News(NewsVO vo) {
		return newsDAO.selectRecent20News(vo);
	}
	 



}

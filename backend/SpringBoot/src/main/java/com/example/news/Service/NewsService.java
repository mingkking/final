package com.example.news.Service;

import java.util.List;

import com.example.news.domain.NewsVO;
import com.example.subscribe.domain.SubscribeVO;
 
public interface NewsService {
	 
	// 뉴스 데이터 중 오늘 데이터 랜덤 10개 가져오기
	List<NewsVO> selectRecent20News(NewsVO vo);
	
	// 증권 뉴스 데이터
	List<NewsVO> selectFinanceNews(NewsVO vo);
	
	// 부동산 뉴스 데이터
	List<NewsVO> selectRENews(NewsVO vo);
	
	// 경제 뉴스 데이터
	List<NewsVO> selectEconomyNews(NewsVO vo);

}

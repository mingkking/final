package com.example.news.dao;
   
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.news.domain.NewsVO;

 
@Mapper 
public interface NewsDAO {
	
	// 뉴스 데이터 중 오늘 데이터 랜덤 10개 가져오기
	public List<NewsVO> selectRecent20News(NewsVO vo);
	
	// 증권 뉴스 데이터
	public List<NewsVO> selectFinanceNews(NewsVO vo);
	
	// 부동산 뉴스 데이터
	public List<NewsVO> selectRENews(NewsVO vo);
	
	// 경제 뉴스 데이터
	public List<NewsVO> selectEconomyNews(NewsVO vo);
	
}
package com.example.news.dao;
   
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.example.news.domain.NewsVO;

 
@Mapper 
public interface NewsDAO {
	
	// 뉴스 최신 20개 값 가져오기
	public List<NewsVO> selectRecent20News(NewsVO vo);
	
}
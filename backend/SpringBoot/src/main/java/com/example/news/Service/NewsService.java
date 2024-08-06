package com.example.news.Service;

import java.util.List;

import com.example.news.domain.NewsVO;
import com.example.subscribe.domain.SubscribeVO;
 
public interface NewsService {
	 
	// 뉴스 최신 20개 값 가져오기
	List<NewsVO> selectRecent20News(NewsVO vo);

}

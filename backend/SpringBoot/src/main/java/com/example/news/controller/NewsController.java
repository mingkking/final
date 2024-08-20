package com.example.news.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.news.Service.NewsService;
import com.example.news.domain.NewsVO;
import com.google.gson.Gson;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

 
@CrossOrigin(origins = "http://localhost:3000")
@RestController  
public class NewsController { 

	@Autowired
	private NewsService newsservice;
	
	@GetMapping("/news")
	public String selectRecent20News(NewsVO vo) {
		
		List<NewsVO> selectRandom10News = newsservice.selectRecent20News(vo);
		List<NewsVO> selectFinanceNews = newsservice.selectFinanceNews(vo);
		List<NewsVO> selectRENews = newsservice.selectRENews(vo);
		List<NewsVO> selectEconomyNews = newsservice.selectEconomyNews(vo);
		
		// Gson 생성
		Gson gson = new Gson();
		
		// Json 생성
		String jsonString = gson.toJson(Map.of(
		        "selectRandom10News", selectRandom10News,
		        "selectFinanceNews", selectFinanceNews,
		        "selectRENews", selectRENews,
		        "selectEconomyNews", selectEconomyNews
		    ));
		
		return jsonString;
		
		
	}


	

}

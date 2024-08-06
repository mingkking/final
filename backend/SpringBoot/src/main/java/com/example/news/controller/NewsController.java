package com.example.news.controller;

import java.util.List;

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
		
		List<NewsVO> newsList = newsservice.selectRecent20News(vo);
		
		// Gson 생성
		Gson gson = new Gson();
		
		String newsListJson = gson.toJson(newsList);
		
		// Json 생성
		String jsonString = "{\"selectRecent20News\":" + newsListJson + "}";
		
		System.out.println("news페이지로 보내는 news20개 값---"+jsonString);
		
		return jsonString;
		
		
	}


	

}

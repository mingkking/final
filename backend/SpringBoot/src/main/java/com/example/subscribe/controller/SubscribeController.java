package com.example.subscribe.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.subscribe.Service.SubscribeService;
import com.example.subscribe.domain.SubscribeVO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

 
@CrossOrigin(origins = "http://localhost:3000")
@RestController  
public class SubscribeController { 

	@Autowired
	private SubscribeService subscribeService;
	
	@PutMapping("/subscribe2/{user_num}")
	public void insertSubscriber(@PathVariable int user_num, SubscribeVO vo) {
		System.out.println(user_num);
		
		vo.setUser_num(user_num);
		
		subscribeService.insertSubscriber(vo);
	}
	
	@GetMapping("/subscribe/{user_num}")
	public int selectSubscriber(@PathVariable int user_num, SubscribeVO vo) {
		System.out.println("로그인 한 회원 값:" + user_num);
		vo.setUser_num(user_num);
		
		int checkSubscribe = subscribeService.selectSubscriber(vo);
		
		System.out.println("구독여부확인------"+ checkSubscribe);
		
		return checkSubscribe;
	}
	


	

}

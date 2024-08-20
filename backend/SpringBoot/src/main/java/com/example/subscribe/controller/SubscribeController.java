package com.example.subscribe.controller;

import java.text.SimpleDateFormat;

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
		
		vo.setUser_num(user_num);
		
		subscribeService.insertSubscriber(vo);
	}
	
	@GetMapping("/subscribe/{user_num}")
	public int selectSubscriber(@PathVariable int user_num, SubscribeVO vo) {

		vo.setUser_num(user_num);
		
		int checkSubscribe = subscribeService.selectSubscriber(vo);
		
		return checkSubscribe;
	}
	
	@GetMapping("/SubscribeSuccess/{user_num}")
	public String subscribeDate(@PathVariable int user_num, SubscribeVO vo) {
		
		vo.setUser_num(user_num);
		
        String checkSubscribe = subscribeService.selectSubscribeDate(vo);

        // 날짜 부분만 추출
        String formattedDate = checkSubscribe.split(" ")[0];

        return formattedDate;
	}
	
	


	

}

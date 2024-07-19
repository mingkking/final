package com.example.controller;

import java.io.Console;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.domain.CountVO;
import com.example.Service.CountService;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CountController {

	@Autowired
	private CountService countService;

	@GetMapping("/")
	public String count(HttpServletRequest request, Model model, CountVO vo) {
		HttpSession session = request.getSession();
		if (session == null) {
			return null;
		}else
			model.addAttribute("sessionId", session.getId());

		vo.setSessionId(session.getId());

		countService.saveSession(vo);

		// 각 객체에 검색한 값 저장
		int selectTotalSession = countService.selectTotalSession();
		int selectTodaySession = countService.selectTodaySession();
		int selectMonthSession = countService.selectMonthSession();
		int selcetTotalMembers = countService.selectTotalMembers();
		int selectTotalSubscribers = countService.selectTotalSubscribers();

		// json 구조를 가진 객체 만들기
		JsonObject group = new JsonObject();

		// group 객체에 값 저장
		group.addProperty("selectTotalSession", selectTotalSession);
		group.addProperty("selectTodaySession", selectTodaySession);
		group.addProperty("selectMonthSession", selectMonthSession);
		group.addProperty("selectTotalMembers", selcetTotalMembers);
		group.addProperty("selectTotalSubscribers", selectTotalSubscribers);

		// json구조를 String 형태로 변환
		Gson gson = new Gson();
		String jsonString = gson.toJson(group);

		return jsonString;

	}
}

package com.example.mgr.controller;

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

import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
import com.example.mgr.Service.MgrCountService;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class MgrCountController {

	// zzzzzz
	@Autowired
	private MgrCountService mgrcountService;

	@GetMapping("/")
	public String count(HttpServletRequest request, Model model, MgrSessionCountVO sessionvo) {
		HttpSession session = request.getSession();
		if (session == null) {
			return null;
		}else
			model.addAttribute("sessionId", session.getId());

		sessionvo.setSessionId(session.getId());

		mgrcountService.saveSession(sessionvo);
		
		// 회원 리스트
		MgrMemberVO membervo = new MgrMemberVO();
		List<MgrMemberVO> memberList = mgrcountService.selectMembers(membervo);

		// 각 객체에 검색한 값 저장
		int selectTotalSession = mgrcountService.selectTotalSession();
		int selectTodaySession = mgrcountService.selectTodaySession();
		int selectMonthSession = mgrcountService.selectMonthSession();
		int selcetTotalMembers = mgrcountService.selectTotalMembers();
		int selectTodayMembers = mgrcountService.selectTodayMembers();
		int selectTotalSubscribers = mgrcountService.selectTotalSubscribers();

		// json 구조를 가진 객체 만들기
		JsonObject group = new JsonObject();

		// group 객체에 값 저장
		group.addProperty("selectTotalSession", selectTotalSession);
		group.addProperty("selectTodaySession", selectTodaySession);
		group.addProperty("selectMonthSession", selectMonthSession);
		group.addProperty("selectTotalMembers", selcetTotalMembers);
		group.addProperty("selectTodayMembers", selectTodayMembers);
		group.addProperty("selectTotalSubscribers", selectTotalSubscribers);

		// json구조의 객체 생성
		Gson gson = new Gson();
		
		// List인 memberList를 Json 배열로 변환
		JsonArray memberListJson = gson.toJsonTree(memberList).getAsJsonArray();
		group.add("selectMemberList", memberListJson);
		
		// json구조를 String 형태로 변환
		String jsonString = gson.toJson(group);

		return jsonString;

	}
}

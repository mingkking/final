package com.example.mgr.controller;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.mgr.Service.MgrService;
import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
import com.example.mgr.domain.MgrCommunityVO;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.text.SimpleDateFormat;
import java.text.DateFormat;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(origins = "http://localhost:3000")
@RestController  
public class MgrController { 

	@Autowired
	private MgrService mgrservice;

	@GetMapping("/")
	public String count(HttpServletRequest request, Model model, MgrSessionCountVO sessionvo) {
	    HttpSession session = request.getSession();
	    if (session == null) {
	        return null;
	    } else {
	        model.addAttribute("sessionId", session.getId());
	    }

	    sessionvo.setSessionId(session.getId());
	    mgrservice.saveSession(sessionvo);
	    
	    
	    // 최근 5일/5달간 가입자 수
	    List<Map<String, Object>> last5DaysMember = mgrservice.selectLast5DaysMember();
	    List<Map<String, Object>> last5MonthsMember = mgrservice.selectLast5MonthsMember();
	    List<Map<String, Object>> last2YearsMember = mgrservice.selectLast2YearsMember();
	    
	    // 각 객체에 검색한 값 저장 
	    int selectTotalSession = mgrservice.selectTotalSession();
	    int selectTodaySession = mgrservice.selectTodaySession();
	    int selectMonthSession = mgrservice.selectMonthSession();
	    int selcetTotalMembers = mgrservice.selectTotalMembers();
	    int selectTodayMembers = mgrservice.selectTodayMembers();
	    int selectTotalSubscribers = mgrservice.selectTotalSubscribers();
	    
	    // last5MonthsMember의 JOIN_MONTH 값을 "M월" 형식으로 변환
	    List<Map<String, Object>> transformedLast5MonthsMember = last5MonthsMember.stream().map(entry -> {
	        String joinMonth = (String) entry.get("JOIN_MONTH");
	        String[] parts = joinMonth.split("-");
	        int month = Integer.parseInt(parts[1]); // "MM"을 int로 변환하여 앞의 '0' 제거
	        String transformedMonth = month + "월"; // M월 형식으로 변환
	        entry.put("JOIN_MONTH", transformedMonth);
	        return entry;
	    }).collect(Collectors.toList());

	    // Gson 객체 생성
	    Gson gson = new Gson();

	    // JSON 문자열 생성
	    String jsonString = gson.toJson(Map.of(
	        "selectTotalSession", selectTotalSession,
	        "selectTodaySession", selectTodaySession,
	        "selectMonthSession", selectMonthSession,
	        "selectTotalMembers", selcetTotalMembers,
	        "selectTodayMembers", selectTodayMembers,
	        "selectTotalSubscribers", selectTotalSubscribers,
	        "selectLast5DaysMember", last5DaysMember,
	        "selectLast5MonthsMember", last5MonthsMember,
	        "selectLast2YearsMember", last2YearsMember
	    ));

	    System.out.println("main으로 보내는 값: " + jsonString); // 확인용

	    return jsonString;
	} // count
	
	// memberList 출력 
	@GetMapping("/manager/memberList")
	public String getMemberList(MgrMemberVO vo) {
		
	    List<MgrMemberVO> memberList = mgrservice.selectMembers(vo);
	    
	    // Gson 객체 생성
	    Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();

	    
	    // List인 memberList를 gson을 이용하여 JSON 문자열로 변환
	    String memberListJsonString = gson.toJson(memberList);
	    
	    
	    // JSON 생성
	    String jsonString = "{\"selectMemberList\":" + memberListJsonString + "}";
	    
	    System.out.println("memberList로 보내는 값: " + jsonString); // 확인용
	    
	    return jsonString;
	}
	
	// 회원 상세정보 보기
    @GetMapping("/manager/memberDetail/{user_num}")
    public String getMemberDetail(@PathVariable String user_num, MgrMemberVO membervo, MgrCommunityVO commvo) {
        
        // 받은 번호 값 지정
    	membervo.setUser_num(user_num);
    	commvo.setUser_num(user_num);
        
        // 회원 상세 정보 조회
        List<MgrMemberVO> mgrMemberDetail = mgrservice.selectMemberDetail(membervo);
        List<MgrCommunityVO> mgrCommPost = mgrservice.selectCommPost(commvo);
      
        // Gson 객체 생성
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
        
        // List인 mgrMemberDetail를 gson을 이용하여 JSON 문자열로 변환
        String jsonString = gson.toJson(Map.of(
                "selectMemberList", mgrMemberDetail,
                "commPost", mgrCommPost
            ));
        
        System.out.println("memberDetail 페이지로 보내는 값:" + jsonString);
        
        return jsonString;
    }
    
    // 회원 정보 수정
    @PutMapping("/manager/memberDetail/{user_num}")
    public int updateMember(@PathVariable String user_num, @RequestBody MgrMemberVO vo) {
    	
    	// 번호 지정
    	vo.setUser_num(user_num);
    	
    	System.out.println("정보 수정 값: " + vo);
    	
    	int updateCount = mgrservice.updateMember(vo);
    	
    	return updateCount;
    }
    
    
    // 회원삭제
    @DeleteMapping("/manager/memberDetail/{user_num}")
    public String deleteMember(@PathVariable String user_num, MgrMemberVO vo) {
        
    	// String으로 받은 user_num 을 int로 바꾸기
    	int userNumInt = Integer.parseInt(user_num);
        
		mgrservice.deleteMember(userNumInt);
		
        return "";
    }    
	
	// 통계 화면에서 countSomething 값 보내기
	@GetMapping("/manager/graph")
	public String getGraphCount() {
		
	    int selectTodaySubscribers = mgrservice.selectTodaySubscribers();
	    List<Map<String, Object>> countByAgeMember = mgrservice.countByAgeMember();
	    
	    // Gson 객체 생성
	    Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
	    
	    // json 생성
	    String jsonString = gson.toJson(Map.of(
		        "selectTodaySubscribers", selectTodaySubscribers,
		        "countByAgeMember", countByAgeMember
		    ));
	    
	    System.out.println("graph로 보내는 값: " + jsonString); // 확인용
	    
	    return jsonString;
	}
	
	// 커뮤니티 관리 화면  
	@GetMapping("/manager/community")
	public String selectCommPostAll(MgrCommunityVO vo) {
		
		List<MgrCommunityVO> commPostList = mgrservice.selectCommPostAll(vo);
		
		Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
		
		String commPostListSt = gson.toJson(commPostList);
		
		// JSON 생성 
	    String jsonString = "{\"selectCommPostAll\":" + commPostListSt + "}";
	    
	    System.out.println("community로 보내는 값: " + jsonString);
	    
	    return jsonString;
	}

}

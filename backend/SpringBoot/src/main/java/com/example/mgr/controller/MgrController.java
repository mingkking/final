package com.example.mgr.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.community.domain.BookmarkVO;
import com.example.mgr.Service.MgrService;
import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
import com.example.mgr.domain.MgrSubscriberCountVO;
import com.example.mgr.domain.MgrBookMarkVO;
import com.example.mgr.domain.MgrCommComplaintVO;
import com.example.mgr.domain.MgrCommunityVO;
import com.example.mgr.domain.MgrInterestEstateVO;
import com.example.mgr.domain.MgrManagerVO;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.text.SimpleDateFormat;
import java.text.DateFormat;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3000")
@RestController  
public class MgrController { 

	@Autowired
	private MgrService mgrservice;

	@GetMapping("/")
	public String count(HttpServletRequest request, Model model, MgrSessionCountVO sessionvo) {
		
		// session 값 가져오기
	    HttpSession session = request.getSession();
	    if (session == null) {
	        return null;
	    } else {
	        model.addAttribute("sessionId", session.getId());
	    }
	    
	    // session 값 저장
	    sessionvo.setSessionId(session.getId());
	    mgrservice.saveSession(sessionvo);

	    return "";
	} // count
	
	// 관리자 메인페이지 카운팅 값 보내기
	@GetMapping("/manager")
	public String getCounting() {
		
	    int selectTotalSession = mgrservice.selectTotalSession();
	    int selectTodaySession = mgrservice.selectTodaySession();
	    int selectMonthSession = mgrservice.selectMonthSession();
	    int selcetTotalMembers = mgrservice.selectTotalMembers(); // 총 회원 수
	    int selectTodayMembers = mgrservice.selectTodayMembers(); // 금일 가입자 수
	    int selectTotalSubscribers = mgrservice.selectTotalSubscribers(); // 총 구독자 수 
 	    List<Map<String, Object>> selectRecent6Mem = mgrservice.selectRecent6Mem(); // 최근 6개월 가입자 수
 	    List<Map<String, Object>> selectRecent6Sub = mgrservice.selectRecent6Sub(); // 최근 6개월 구독자 수
 	   
	    List<Map<String, Object>> transformedSelectRecent6Sub = transformJoinMonth(selectRecent6Sub);
 	    List<Map<String, Object>> transformedSelectRecent6Mem = transformJoinMonth(selectRecent6Mem);
 	   
	    // Gson 객체 생성
	    Gson gson = new Gson();
	    
	    // JSON 문자열 생성
	    String jsonString = gson.toJson(Map.of(
	        "selectTotalMembers", selcetTotalMembers,
	        "selectTodayMembers", selectTodayMembers,
	        "selectTotalSubscribers", selectTotalSubscribers,
	        "selectTotalSession", selectTotalSession,
	        "selectTodaySession", selectTodaySession,
	        "selectMonthSession", selectMonthSession,
		    "selectRecent6Mem", transformedSelectRecent6Mem,
		    "selectRecent6Sub", transformedSelectRecent6Sub
	    ));
	    
	    System.out.println("manager/main으로 보내는 값: " + jsonString); // 확인용
	    
	    return jsonString;
	}
	
	
	// 관리자 여부 확인
	@GetMapping("/manager/{user_num}")
	public int checkMgr(@PathVariable int user_num, MgrManagerVO vo) {

		String mgrCheckNum = String.valueOf(user_num);
		
		vo.setManager_num(mgrCheckNum);
		int checkMgr = mgrservice.checkManager(vo);
		
		System.out.println("로그인 회원 번호----- " + mgrCheckNum + "매니저인지아닌지 -------" + checkMgr);
		
	    return checkMgr;
	}
	
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
    public String getMemberDetail(@PathVariable String user_num, MgrMemberVO membervo, MgrCommunityVO commvo, 
    		                      MgrManagerVO mgrvo, MgrSubscriberCountVO subvo, MgrBookMarkVO bmvo, MgrInterestEstateVO esvo) {
        
        // 받은 번호 값 지정
    	membervo.setUser_num(user_num);
    	commvo.setUser_num(user_num);
    	mgrvo.setManager_num(user_num);
    	subvo.setUser_num(user_num);
    	bmvo.setUser_num(user_num);
    	esvo.setUser_num(user_num);
    	
    	
        // 회원 상세 정보 조회
        List<MgrMemberVO> mgrMemberDetail = mgrservice.selectMemberDetail(membervo);
        List<MgrCommunityVO> mgrCommPost = mgrservice.selectCommPost(commvo);
        int checkMgr = mgrservice.checkManager(mgrvo);
        List<MgrSubscriberCountVO> checksubscribe = mgrservice.checkSubscribe(subvo);
        List<MgrBookMarkVO> getBookMarkList = mgrservice.selectBookmark(bmvo);
        List<MgrInterestEstateVO> interestEstate = mgrservice.interestEstate(esvo);
              
        
        // Gson 객체 생성
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
        
        // List인 mgrMemberDetail를 gson을 이용하여 JSON 문자열로 변환
        String jsonString = gson.toJson(Map.of(
                "selectMemberList", mgrMemberDetail,
                "commPost", mgrCommPost,
                "checkMgr", checkMgr,
                "checkSubscribe", checksubscribe,
                "selectBookMark", getBookMarkList,
                "interestEstate", interestEstate
            ));
        
        System.out.println("memberDetail 페이지로 보내는 값:" + jsonString);
        
        return jsonString;
    }
    
    // 회원 정보 수정
    @PutMapping("/manager/memberDetail/{user_num}")
    public int updateMember(@PathVariable String user_num, @RequestBody MgrMemberVO membervo, MgrManagerVO mgrvo) {
    	
    	// 번호 지정
    	membervo.setUser_num(user_num);
    	
    	// 값이 1이면 관리자로 수정 한 것
    	int checkMgr = membervo.getIs_admin();
    	
    	if (checkMgr == 1) {
    		mgrvo.setManager_num(user_num);
    		mgrservice.insertManager(mgrvo);
    	} else {
    		int managerNumInt = Integer.parseInt(user_num);
    		mgrservice.deleteManager(managerNumInt);
    	}
    	
    	System.out.println("수정 한 내용 : " + membervo);
    	
    	int updateCount = mgrservice.updateMember(membervo);
    	
    	return updateCount;
    }
    
    
    // 회원삭제
    @DeleteMapping("/manager/memberDetail/{user_num}")
    public void deleteMember(@PathVariable int user_num) {
        
		mgrservice.deleteMember(user_num);
		
    };
	
	// 통계 화면에서 countSomething 값 보내기
	@GetMapping("/manager/graph")
	public String getGraphCount() {
		
	    int selectTodaySubscribers = mgrservice.selectTodaySubscribers(); // 구독자 수
	    int selectCommCount = mgrservice.selectCommCount(); // 커뮤니티 게시글 수
	    int selectTotalSession = mgrservice.selectTotalSession(); // 총 방문자 수
	    int selectTodaySession = mgrservice.selectTodaySession(); // 금일 방문자 수
	    List<Map<String, Object>> countByAgeMember = mgrservice.countByAgeMember(); // 연령대
	    List<Map<String, Object>> last5DaysMember = mgrservice.selectLast5DaysMember(); // 최근 5일 가입자 수
	    List<Map<String, Object>> last5MonthsMember = mgrservice.selectLast5MonthsMember(); // 최근 5달 가입자 수
	    List<Map<String, Object>> last2YearsMember = mgrservice.selectLast2YearsMember(); // 최근 2년 가입자 수
	    int countReply = mgrservice.countReply(); // 댓글 수
	    int userLike = mgrservice.userLike(); // 좋아요 수
	    int CPPostCount = mgrservice.selectCPPostCount(); // 신고 게시글 수
	    int CPReplyCount = mgrservice.selectCPReplyCount(); // 신고 댓글 수
	    List<Map<String, Object>> selectRecent6Sub = mgrservice.selectRecent6Sub(); // 최근 6개월 구독자 수
	    List<Map<String, Object>> selectLastYearSub = mgrservice.selectLastYearSub(); // 작년 6개월 구독자 수
	    int selcetTotalMembers = mgrservice.selectTotalMembers(); // 총 회원 수
	    int selectTodayMembers = mgrservice.selectTodayMembers(); // 금일 가입자 수
	    int selectTotalSubscribers = mgrservice.selectTotalSubscribers(); // 총 구독자 수 

	    
	    // YYYY-MM 형식을 MM월로 변경하는 함수 적용
	    List<Map<String, Object>> transformedLast5MonthsMember = transformJoinMonth(last5MonthsMember);
	    List<Map<String, Object>> transformedSelectRecent6Sub = transformJoinMonth(selectRecent6Sub);
	    List<Map<String, Object>> transformedSelectLastYearSub = transformJoinMonth(selectLastYearSub);
	    
	    
	    // last5DaysMember의 JOIN_DATE 값을 "DD일" 형식으로 변환
	    List<Map<String, Object>> transformedLast5DaysMember = last5DaysMember.stream().map(entry -> {
	        String joinDays = (String) entry.get("JOIN_DATE");
	        if (joinDays != null) {
	            String[] parts = joinDays.split("-");
	            int day = Integer.parseInt(parts[2]); // "DD"를 int로 변환하여 앞의 '0' 제거
	            String transformedDay = day + "일"; // DD일 형식으로 변환
	            entry.put("JOIN_DATE", transformedDay);
	        }
	        return entry;
	    }).collect(Collectors.toList());
	    
	    // Gson 객체 생성
	    Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();

	    
	 // HashMap 생성 및 데이터 추가
	    Map<String, Object> map = new HashMap<>();
	    map.put("selectTodaySubscribers", selectTodaySubscribers);
	    map.put("selectCommCount", selectCommCount);
	    map.put("countByAgeMember", countByAgeMember);
	    map.put("selectLast5DaysMember", last5DaysMember);
	    map.put("selectLast5MonthsMember", transformedLast5MonthsMember);
	    map.put("selectLast2YearsMember", last2YearsMember);
	    map.put("selectTotalSession", selectTotalSession);
	    map.put("selectTodaySession", selectTodaySession);
	    map.put("countReply", countReply);
	    map.put("userLike", userLike);
	    map.put("CPPostCount", CPPostCount);
	    map.put("CPReplyCount", CPReplyCount);
	    map.put("selectRecent6Sub", transformedSelectRecent6Sub);
	    map.put("selectLastYearSub", transformedSelectLastYearSub);
	    map.put("selectTotalMembers", selcetTotalMembers);
	    map.put("selectTodayMembers", selectTodayMembers);
	    map.put("selectTotalSubscribers", selectTotalSubscribers);  


	    // JSON 문자열로 변환
	    String jsonString = gson.toJson(map);
	    
	    System.out.println("graph로 보내는 값: " + jsonString); // 확인용
	    
	    return jsonString;
	}
	
	// JOIN_MONTH 값을 "M월" 형식으로 변환
	private List<Map<String, Object>> transformJoinMonth(List<Map<String, Object>> data) {
	    return data.stream().map(entry -> {
	        String joinMonth = (String) entry.get("JOIN_MONTH");
	        String[] parts = joinMonth.split("-");
	        int month = Integer.parseInt(parts[1]); // "MM"을 int로 변환하여 앞의 '0' 제거
	        String transformedMonth = month + "월"; // M월 형식으로 변환
	        entry.put("JOIN_MONTH", transformedMonth);
	        return entry;
	    }).collect(Collectors.toList());
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
	
	// 커뮤니티 게시글 신고 관리
	@GetMapping("/manager/complaint/communityPost")
	public String getComplaintPost(MgrCommComplaintVO vo) {
		
		List<MgrCommComplaintVO> commPostComplaint = mgrservice.selectComplaintPost(vo);
		
		Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
		
		String commPostComplaintSt = gson.toJson(commPostComplaint);
		
		String jsonString = "{\"selectCommPostComplaint\":" + commPostComplaintSt + "}";
		
		System.out.println("complaint/communityPost으로 보내는 값 : " + jsonString);
		
		return jsonString;
	}
	
	// 커뮤니티 댓글 신고 관리
	@GetMapping("/manager/complaint/communityComment")
	public String getComplaintCmt(MgrCommComplaintVO vo) {
		
		List<MgrCommComplaintVO> commCmtComplaint = mgrservice.selectComplaintCmt(vo);
		
		Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
		
		String commCmtComplaintSt = gson.toJson(commCmtComplaint);
		
		String jsonString = "{\"selectCommCmpComplaint\":" + commCmtComplaintSt + "}";
		
		System.out.println("complaint/communityPost으로 보내는 값 : " + jsonString);
		
		return jsonString;
	}
	
	// 커뮤니티 게시글 신고 상세보기
	@GetMapping("/manager/complaint/commPostDetail/{id}")
	public String complaintPostDetail(@PathVariable int id, MgrCommComplaintVO vo) {
		
		vo.setId(id);
		
		List<MgrCommComplaintVO> complaintPostDetail = mgrservice.selectComplaintPostDetail(vo);
		
		Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
		
		String complaintPostDetailSt = gson.toJson(complaintPostDetail);
		
		String jsonString = "{\"complaintPostDetail\":" + complaintPostDetailSt + "}";
		
		System.out.println("커뮤니티 게시글 신고 상세보기 페이지로 보내는 값: " + jsonString);
		
		return jsonString;
	}
	
	// 게시글/댓글 신고 상세보기에서 회원 삭제
	@DeleteMapping("/manager/complaint/deleteMember/{user_num}")
	public void deleteMemberInManagerPage(@PathVariable int user_num) {

		mgrservice.deleteMember(user_num);
	}
	
	// 게시글 신고 상세보기에서 게시글 삭제
	@DeleteMapping("manager/complaint/commPostDetail/deletePost/{id}")
	public void deletePost(@PathVariable int id) {
		
		mgrservice.deleteCommPost(id);
	}
	
	// 댓글 신고 상세보기
	@GetMapping("/manager/complaint/commReplyDetail/{id}")
	public String complaintReplyDetail(@PathVariable int id, MgrCommComplaintVO vo) {
		vo.setId(id);
		
		List<MgrCommComplaintVO> complaintReplyDetail = mgrservice.selectComplaintReplyDetail(vo);
		
		Gson gson = new GsonBuilder()
                .setDateFormat("yyyy년 M월 d일") // 날짜 포맷 문자열 직접 설정
                .create();
		
		String complaintReplyDetailSt = gson.toJson(complaintReplyDetail);
		
		String jsonString = "{\"complaintReplyDetail\":" + complaintReplyDetailSt + "}";
		
		System.out.println("커뮤니티 댓글 신고 상세보기 페이지로 보내는 값 : " + jsonString);
		
		return jsonString;
	}
	
	// 댓글 신고 상세보기에서 댓글 삭제
	@DeleteMapping("/manager/complaint/commReplyDetail/deleteReply/{reply_num}")
	public void deleteReply(@PathVariable int reply_num) {
		
		mgrservice.deleteCommReply(reply_num);
	}
	
	
	

}

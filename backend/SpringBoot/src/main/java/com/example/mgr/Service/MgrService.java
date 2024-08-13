package com.example.mgr.Service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
import com.example.mgr.domain.MgrBookMarkVO;
import com.example.mgr.domain.MgrCommunityVO;
import com.example.mgr.domain.MgrInterestEstateVO;
import com.example.mgr.domain.MgrManagerVO;
import com.example.mgr.domain.MgrSubscriberCountVO;
    
public interface MgrService {
	 
	// session 값 저장
	int saveSession(MgrSessionCountVO vo);
	 
	// 방문자 수 count
	int selectTotalSession();
	int selectTodaySession();
	int selectMonthSession();
	
	// 회원 수 count
	int selectTotalMembers();
	int selectTodayMembers();
	
	// 최근 5일/5달간 가입자 수
	List<Map<String, Object>> selectLast5DaysMember();
	List<Map<String, Object>> selectLast5MonthsMember();
	List<Map<String, Object>> selectLast2YearsMember();
	
	// 구독자 수 count
	int selectTotalSubscribers();
	int selectTodaySubscribers();
	
	// 회원 연령대
	List<Map<String, Object>> countByAgeMember();
	
	// 회원 목록
	List<MgrMemberVO> selectMembers(MgrMemberVO vo);
	
	// 회원 상세 목록
	List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo);
	
	// 회원 상세 목록 페이지의 커뮤니티 정보
	List<MgrCommunityVO> selectCommPost(MgrCommunityVO vo);
	
	// 구독 여부
	List<MgrSubscriberCountVO> checkSubscribe(MgrSubscriberCountVO vo);
	
	// 회원 삭제
	void deleteMember(int user_num);
	
	// 회원 수정
	int updateMember(MgrMemberVO vo);
	
	// 커뮤니티 관리 목록
	List<MgrCommunityVO> selectCommPostAll(MgrCommunityVO vo);
	
	// 커뮤니티 글 카운팅
	int selectCommCount();
	
	// 관리자 확인
	int checkManager(MgrManagerVO vo);
	
	// 관리자 권한 부여
	void insertManager(MgrManagerVO vo);
	
	// 관리자 권한 삭제
	void deleteManager(int manager_num);
	
	// 북마크
	List<MgrBookMarkVO> selectBookmark(MgrBookMarkVO vo);
	
	// 댓글 수
	int countReply();
	
	// 부동산 관심
	List<MgrInterestEstateVO> interestEstate(MgrInterestEstateVO vo);
}

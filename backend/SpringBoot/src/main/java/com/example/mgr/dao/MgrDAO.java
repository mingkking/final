package com.example.mgr.dao;
   
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.example.community.domain.BookmarkVO;
import com.example.mgr.domain.MgrBookMarkVO;
import com.example.mgr.domain.MgrCommComplaintVO;
import com.example.mgr.domain.MgrCommunityVO;
import com.example.mgr.domain.MgrInterestEstateVO;
import com.example.mgr.domain.MgrManagerVO;
import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
import com.example.mgr.domain.MgrSubscriberCountVO;

@Mapper   
public interface MgrDAO {
	
	// session 값 저장
	public int saveSession(MgrSessionCountVO vo);
	
	// 방문자 수
	public int selectTotalSession();
	public int selectTodaySession();
	public int selectMonthSession();
	
	// 회원 수
	public int selectTotalMembers();
	public int selectTodayMembers();
	public List<Map<String, Object>> selectLast5DaysMember();
	public List<Map<String, Object>> selectLast5MonthsMember();
	public List<Map<String, Object>> selectLast2YearsMember();
	
	// 구독자 수
	public int selectTotalSubscribers();
	public int selectTodaySubscribers();
	
	// 회원 연령대
	public List<Map<String, Object>> countByAgeMember();
	
	// 회원 목록
	public List<MgrMemberVO> selectMembers(MgrMemberVO vo);
	
	// 회원 상세 목록
	public List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo);
	
	// 회원 삭제
	public void deleteMember(int user_num);

	// 회원 상세 목록 페이지의 커뮤니티 정보
	public List<MgrCommunityVO> selectCommPost(MgrCommunityVO vo);
	
	// 회원 수정
	public int updateMember(MgrMemberVO vo);
	
	// 커뮤니티 관리 목록
	public List<MgrCommunityVO> selectCommPostAll(MgrCommunityVO vo);
	
	// 커뮤니티 글 카운팅
	public int selectCommCount();
	
	// 관리자 확인
	public int checkManager(MgrManagerVO vo);
	
	// 관리자 권한 부여
	public void insertManager(MgrManagerVO vo);
	
	// 관리자 권한 삭제
	public void deleteManager(int manager_num);
	
	// 구독 여부 확인
	public List<MgrSubscriberCountVO> checkSubscribe(MgrSubscriberCountVO vo);
	
	// 북마크
	public List<MgrBookMarkVO> selectBookmark(MgrBookMarkVO vo);
	
	// 댓글 수
	public int countReply();
	
	// 부동산 관심
	public List<MgrInterestEstateVO> interestEstate(MgrInterestEstateVO vo);
	
	// 좋아요 수
	public int userLike();
	
	// 커뮤니티 게시글 신고 목록
	public List<MgrCommComplaintVO> selectComplaintPost(MgrCommComplaintVO vo);
	
	// 커뮤니티 댓글 신고 목록
	public List<MgrCommComplaintVO> selectComplaintCmt(MgrCommComplaintVO vo);
	
	// 커뮤니티 게시글 신고 상세보기
	public List<MgrCommComplaintVO> selectComplaintPostDetail(MgrCommComplaintVO vo);
	
	// 커뮤니티 게시글 삭제 
	public void deleteCommPost(int id);
	
	// 게시글 신고 수
	public int selectCPPostCount();
	
	// 댓글 신고 수
	public int selectCPReplyCount();
	
	// 커뮤니티 댓글 신고 상세보기
	public List<MgrCommComplaintVO> selectComplaintReplyDetail(MgrCommComplaintVO vo);
	
	// 커뮤니티 댓글 삭제
	public void deleteCommReply(int reply_num);
	
	// 최근 6개월 구독자 수
	public List<Map<String, Object>> selectRecent6Sub();
	
	// 작년 6개월 구독자 수
	public List<Map<String, Object>> selectLastYearSub();
	
	// 최근 6개월 가입자 수
	public List<Map<String, Object>> selectRecent6Mem();
}
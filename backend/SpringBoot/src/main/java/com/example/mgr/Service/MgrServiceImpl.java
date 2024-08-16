package com.example.mgr.Service;

import java.util.List;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.example.community.domain.BookmarkVO;
import com.example.mgr.dao.MgrDAO;
import com.example.mgr.domain.MgrBookMarkVO;
import com.example.mgr.domain.MgrCommComplaintVO;
import com.example.mgr.domain.MgrCommunityVO;
import com.example.mgr.domain.MgrInterestEstateVO;
import com.example.mgr.domain.MgrManagerVO;
import com.example.mgr.domain.MgrMemberVO;
import com.example.mgr.domain.MgrSessionCountVO;
import com.example.mgr.domain.MgrSubscriberCountVO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

  
@Service 
public class MgrServiceImpl implements MgrService {
	 
	@Autowired
	private MgrDAO mgrDAO;  

	// 세션 값 저장 
	public int saveSession(MgrSessionCountVO vo) {
		int result = mgrDAO.saveSession(vo);
		return result;
	}

	// 총 방문자 수
	public int selectTotalSession() {
		return mgrDAO.selectTotalSession();
	}

	// 금일 방문자 수
	public int selectTodaySession() {
		return mgrDAO.selectTodaySession();
	}

	// 한달 방문자 수
	public int selectMonthSession() {
		return mgrDAO.selectMonthSession();
	}

	// 총 회원 수
	public int selectTotalMembers() {
		return mgrDAO.selectTotalMembers();
	}

	// 총 구독자 수
	public int selectTotalSubscribers() {
		return mgrDAO.selectTotalSubscribers();
	}
	
	// 금일 구독자 수
	public int selectTodaySubscribers() {
		return mgrDAO.selectTodaySubscribers();
	}

	// 금일 가입자 수
	public int selectTodayMembers() {
		return mgrDAO.selectTodayMembers();
	}

	// 회원 목록
	public List<MgrMemberVO> selectMembers(MgrMemberVO vo) {
		return mgrDAO.selectMembers(vo);
	}

	// 회원 상세 목록
	public List<MgrMemberVO> selectMemberDetail(MgrMemberVO vo) {
		return mgrDAO.selectMemberDetail(vo);
	}

	// 회원 삭제
	public void deleteMember(int user_num) {
		mgrDAO.deleteMember(user_num);
	}

	// 최근 5일간 가입자 수
	public List<Map<String, Object>> selectLast5DaysMember() {
		return mgrDAO.selectLast5DaysMember();
	}

	// 최근 5달간 가입자 수
	public List<Map<String, Object>> selectLast5MonthsMember() {
		return mgrDAO.selectLast5MonthsMember();
	}

	// 최근 2년간 가입자 수
	public List<Map<String, Object>> selectLast2YearsMember() {
		return mgrDAO.selectLast2YearsMember();
	}

	// 회원 연령대
	public List<Map<String, Object>> countByAgeMember() {
		return mgrDAO.countByAgeMember();
	}

	// 회원 상세 목록 페이지의 커뮤니티 정보
	public List<MgrCommunityVO> selectCommPost(MgrCommunityVO vo) {
		return mgrDAO.selectCommPost(vo);
	}

	// 회원 수정
	public int updateMember(MgrMemberVO vo) {
		mgrDAO.updateMember(vo);
		return 1;
	}

	// 커뮤니티 관리 목록
	public List<MgrCommunityVO> selectCommPostAll(MgrCommunityVO vo) {
		return mgrDAO.selectCommPostAll(vo);
	}

	// 커뮤니티 글 카운팅
	public int selectCommCount() {
		return mgrDAO.selectCommCount();
	}

	// 관리자 확인
	public int checkManager(MgrManagerVO vo) {
		int result = mgrDAO.checkManager(vo);
		return result;
	}

	// 관리자 권한 부여
	public void insertManager(MgrManagerVO vo) {
		mgrDAO.insertManager(vo);
		
	}

	// 관리자 권한 삭제
	public void deleteManager(int manager_num) {
		mgrDAO.deleteManager(manager_num);
		
	}

	// 구독 여부 확인
	public List<MgrSubscriberCountVO> checkSubscribe(MgrSubscriberCountVO vo) {
		return mgrDAO.checkSubscribe(vo);
	}

	// 북마크
	public List<MgrBookMarkVO> selectBookmark(MgrBookMarkVO vo) {
		return mgrDAO.selectBookmark(vo);
	}

	// 댓글 수
	public int countReply() {
		int count = mgrDAO.countReply();
		return count;
	}

	// 부동산 관심
	public List<MgrInterestEstateVO> interestEstate(MgrInterestEstateVO vo) {
		return mgrDAO.interestEstate(vo);
	}

	// 좋아요 수
	public int userLike() {
		return mgrDAO.userLike();
	}

	// 커뮤니티 게시글 신고 리스트
	public List<MgrCommComplaintVO> selectComplaintPost(MgrCommComplaintVO vo) {
		return mgrDAO.selectComplaintPost(vo);
	}

	// 커뮤니티 댓글 신고 리스트
	public List<MgrCommComplaintVO> selectComplaintCmt(MgrCommComplaintVO vo) {
		return mgrDAO.selectComplaintCmt(vo);
	}

	// 커뮤니티 게시글 신고 상세보기
	public List<MgrCommComplaintVO> selectComplaintPostDetail(MgrCommComplaintVO vo) {
		return mgrDAO.selectComplaintPostDetail(vo);
	}

	// 게시글 삭제
	public void deleteCommPost(int id) {
		mgrDAO.deleteCommPost(id);
	}

	// 게시글 신고 수
	public int selectCPPostCount() {
		return mgrDAO.selectCPPostCount();
	}

	// 댓글 신고 수
	public int selectCPReplyCount() {
		return mgrDAO.selectCPReplyCount();
	}

	// 커뮤니티 댓글 신고 상세보기
	public List<MgrCommComplaintVO> selectComplaintReplyDetail(MgrCommComplaintVO vo) {
		return mgrDAO.selectComplaintReplyDetail(vo);
	}

	// 커뮤니티 댓글 삭제
	public void deleteCommReply(int reply_num) {
		mgrDAO.deleteCommReply(reply_num);
		
	}

}


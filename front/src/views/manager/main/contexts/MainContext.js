import React, { createContext, useState, useEffect } from "react";

const mainContext = createContext();

const MainProvider = (props) => {

      // 총 회원 수
      const [membersCount, setMembersCount] = useState(() => {
        const saved = localStorage.getItem("membersCount");
        return saved ? JSON.parse(saved) : 0;
      });

      // 일 가입자 수
      const [todayMembersCount, setTodayMembersCount] = useState(() => {
        const saved = localStorage.getItem("todayMembersCount");
        return saved ? JSON.parse(saved) : 0;
      });

      // 최근 5일 가입자 수
      const [last5DaysMember, setLast5DaysMember] = useState(() => {
        const saved = localStorage.getItem("last5DaysMember");
        return saved ? JSON.parse(saved) : 0;
      });

      // 총 구독자 수
      const [totalSubscribersCount, setTotalSubscribersCount] = useState(() => {
        const saved = localStorage.getItem("totalSubscribersCount");
        return saved ? JSON.parse(saved) : 0;
      });

      // 회원 리스트
      const [memberList, setMemberList] = useState(() => {
        const saved = localStorage.getItem("memberList");
        return saved ? JSON.parse(saved) : [];
      });

      // 관리자 여부 확인용 유저 번호
      const [userNum, setUserNum] = useState("");

      // 관리자면 ifAdmin1 값이 True임
      const [ifAdmin1, setIfAdmin1] = useState("");

      // 총 방문자 수
      const [totalCount, setTotalCount] = useState("");

      // 금일 방문자 수
      const [todayCount, setTodayCount] = useState("");

      // 한 달 방문자 수
      const [monthCount, setMonthCount] = useState("");

      // 최근 5달 가입자 수 
      const [last5MonthsMember, setLast5MonthsMember] = useState("");

      // 최근 2년 가입자 수
      const [last2YearsMember, setLast2YearsMember] = useState("");
      
      // 금일 구독자 수 
      const [todaySubscribersCount, setTodaySubscribersCount] = useState("");

      // 연령대
      const [countByAgeMember, setCountByAgeMember] = useState([]);

      // 커뮤니티 게시글 카운팅
      const [commCount, setCommCount] = useState("");

      // 뉴스
      const [news, setNews] = useState([]);

      // 댓글 수
      const [countReply, setCountReply] = useState("");

      // 채팅방 수
      const [chatRoomCount, setChatRoomCount] = useState("");

      // 좋아요 수
      const [userLike, setUserLike] = useState("");

      // 채팅방 목록
      const [chatList, setChatList] = useState([]);

      // 게시글 신고 수
      const [CPPostCount, setCPPostCount] = useState("");

      // 댓글 신고 수
      const [CPReplyCount, setCPReplyCount] = useState("");

  useEffect(() => {
    localStorage.setItem("membersCount", JSON.stringify(membersCount));
  },[membersCount]);

  useEffect(() => {
    localStorage.setItem("todayMembersCount", JSON.stringify(todayMembersCount));
  }, [todayMembersCount]);

  useEffect(() => {
    localStorage.setItem("last5DaysMember", JSON.stringify(last5DaysMember));
  }, [last5DaysMember]);

  useEffect(() => {
    localStorage.setItem("totalSubscribersCount", JSON.stringify(totalSubscribersCount));
  }, [totalSubscribersCount]);

  useEffect(() => {
    localStorage.setItem("memberList", JSON.stringify(memberList));
  }, [memberList]);


  const values = {
    state: { totalCount, todayCount, monthCount, membersCount, totalSubscribersCount, 
      todaySubscribersCount, todayMembersCount, last5DaysMember, last5MonthsMember, last2YearsMember,
      memberList, countByAgeMember, commCount, userNum, ifAdmin1, news, countReply, chatRoomCount,
      userLike, chatList, CPPostCount, CPReplyCount },
    actions: { setTotalCount, setTodayCount, setMonthCount, setMembersCount, setTotalSubscribersCount, 
      setTodaySubscribersCount, setTodayMembersCount, setLast5DaysMember, setLast5MonthsMember, setLast2YearsMember, 
      setMemberList, setCountByAgeMember, setCommCount, setUserNum, setIfAdmin1, setNews, setCountReply, setChatRoomCount,
      setUserLike, setChatList, setCPPostCount, setCPReplyCount }
  }

  return (
    <mainContext.Provider value={values}>
      {props.children}
    </mainContext.Provider>
  );
}

export { MainProvider };
export default mainContext;

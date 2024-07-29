import React, { createContext, useState, useEffect } from "react";

const mainContext = createContext();

const MainProvider = (props) => {
      // 총 방문자 수
      const [totalCount, setTotalCount] = useState(() => {
        const saved = localStorage.getItem("totalCount");
        return saved ? JSON.parse(saved) : 0;
      });
      
      // 일 방문자 수
      const [todayCount, setTodayCount] = useState(() => {
        const saved = localStorage.getItem("todayCount");
        return saved ? JSON.parse(saved) : 0;
      });
      
      // 월 방문자 수
      const [monthCount, setMonthCount] = useState(() => {
        const saved = localStorage.getItem("monthCount");
        return saved ? JSON.parse(saved) : 0;
      });   

      // 총 회원 수
      const [membersCount, setMembersCount] = useState(() => {
        const saved = localStorage.getItem("membersCount");
        return saved ? JSON.parse(saved) : 0;
      });

      // 일 가입자 수
      const [todayMembersCount, setTodayMembersCount] = useState(() => {
        const saved = localStorage.getItem("todayMembersCount");
        console.log("로컬스토리지----", localStorage);
        return saved ? JSON.parse(saved) : 0;
      });

      // 최근 5일 가입자 수
      const [last5DaysMember, setLast5DaysMember] = useState(() => {
        const saved = localStorage.getItem("last5DaysMember");
        return saved ? JSON.parse(saved) : 0;
      });

      // 최근 5달 가입자 수
      const [last5MonthsMember, setLast5MonthsMember] = useState(() => {
        const saved = localStorage.getItem("last5MonthsMember");
        return saved ? JSON.parse(saved) : 0;
      });

      // 최근 2년 가입자 수
      const [last2YearsMember, setLast2YearsMember] = useState(() => {
        const saved = localStorage.getItem("last2YearsMember");
        return saved ? JSON.parse(saved) : 0;
      });

      // 총 구독자 수
      const [totalSubscribersCount, setTotalSubscribersCount] = useState(() => {
        console.log("localstorage-----------", localStorage);
        const saved = localStorage.getItem("totalSubscribersCount");
        return saved ? JSON.parse(saved) : 0;
      });

      // 금일 구독자 수 
      const [todaySubscribersCount, setTodaySubscribersCount] = useState(() => {
        const saved = localStorage.getItem("todaySubscribersCount");
        return saved ? JSON.parse(saved) : 0;
      });

      // 회원 리스트
      const [memberList, setMemberList] = useState(() => {
        const saved = localStorage.getItem("memberList");
        console.log("memberList react -------", saved);
        return saved ? JSON.parse(saved) : [];
      });

      // 회원 연령대
      const [countByAgeMember, setCountByAgeMember] = useState(() => {
        const saved = localStorage.getItem("countByAgeMember");
        return saved ? JSON.parse(saved) : 0;
      });
      

  // 값이 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("totalCount", JSON.stringify(totalCount));
  }, [totalCount]);

  useEffect(() => {
    localStorage.setItem("todayCount", JSON.stringify(todayCount));
  }, [todayCount]);

  useEffect(() => {
    localStorage.setItem("monthCount", JSON.stringify(monthCount));
  }, [monthCount]);

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
    localStorage.setItem("last5MonthsMember", JSON.stringify(last5MonthsMember));
  }, [last5MonthsMember]);

  useEffect(() => {
    localStorage.setItem("last2YearsMember", JSON.stringify(last2YearsMember));
  }, [last2YearsMember]);

  useEffect(() => {
    localStorage.setItem("totalSubscribersCount", JSON.stringify(totalSubscribersCount));
  }, [totalSubscribersCount]);

  useEffect(() => {
    localStorage.setItem("todaySubscribersCount", JSON.stringify(todaySubscribersCount));
  }, [todaySubscribersCount]);

  useEffect(() => {
    localStorage.setItem("memberList", JSON.stringify(memberList));
  }, [memberList]);

  useEffect(() => {
    localStorage.setItem("countByAgeMember", JSON.stringify(countByAgeMember));
  }, [countByAgeMember]);  


  const values = {
    state: { totalCount, todayCount, monthCount, membersCount, totalSubscribersCount, 
      todaySubscribersCount, todayMembersCount, last5DaysMember, last5MonthsMember, last2YearsMember, memberList, countByAgeMember },
    actions: { setTotalCount, setTodayCount, setMonthCount, setMembersCount, setTotalSubscribersCount, 
      setTodaySubscribersCount, setTodayMembersCount, setLast5DaysMember, setLast5MonthsMember, setLast2YearsMember, setMemberList, setCountByAgeMember }
  }

  return (
    <mainContext.Provider value={values}>
      {props.children}
    </mainContext.Provider>
  );
}

export { MainProvider };
export default mainContext;

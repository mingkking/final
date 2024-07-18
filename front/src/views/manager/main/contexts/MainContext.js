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

      // 총 구독자 수
      const [totalSubscribersCount, setTotalSubscribersCount] = useState(() => {
        const saved = localStorage.getItem("subscribersCount");
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
    localStorage.setItem("subscriberscount", JSON.stringify(totalSubscribersCount));
  });


  const values = {
    state: { totalCount, todayCount, monthCount, membersCount, totalSubscribersCount },
    actions: { setTotalCount, setTodayCount, setMonthCount, setMembersCount, setTotalSubscribersCount }
  }

  return (
    <mainContext.Provider value={values}>
      {props.children}
    </mainContext.Provider>
  );
}

export { MainProvider };
export default mainContext;

import React, { createContext, useState, useEffect } from "react";

const mainContext = createContext();

const MainProvider = (props) => {
    const [totalCount, setTotalCount] = useState(() => {
        // 로컬 스토리지에서 초기 값 가져오기
        const saved = localStorage.getItem("totalCount");
        return saved ? JSON.parse(saved) : 0;
      });
      
      const [todayCount, setTodayCount] = useState(() => {
        const saved = localStorage.getItem("todayCount");
        return saved ? JSON.parse(saved) : 0;
      });
      
      const [monthCount, setMonthCount] = useState(() => {
        const saved = localStorage.getItem("monthCount");
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

  const values = {
    state: { totalCount, todayCount, monthCount },
    actions: { setTotalCount, setTodayCount, setMonthCount }
  }

  return (
    <mainContext.Provider value={values}>
      {props.children}
    </mainContext.Provider>
  );
}

export { MainProvider };
export default mainContext;

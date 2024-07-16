import { createContext, useState } from "react";
      const mainContext = createContext();
      // 생성자
      const MainProvider = (props) => {
        const [totalCount, setTotalCount] = useState([]);
        const [todayCount, setTodayCount] = useState([]);
        const [monthCount, setMonthCount] = useState([]);


      
          const values = {
              state : { totalCount, todayCount, monthCount },
              actions : { setTotalCount, setTodayCount, setMonthCount }
          }
      
          return (
              <mainContext.Provider value={values}>
                  {props.children}
              </mainContext.Provider>
          );
      }
      
      export {MainProvider};
      export default mainContext;


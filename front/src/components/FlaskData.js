import React, { useEffect, useState } from 'react';

function FlaskData() {
  const [data, setData] = useState(null); // 데이터를 저장할 상태 변수 선언

  useEffect(() => {
    fetch("/users")
      .then(res => res.json()) // response 객체의 json() 메서드로 JSON 데이터를 객체로 변환
      .then(data => {
        setData(data); // 변환된 데이터를 상태 변수에 저장
      })
      .catch(error => {
        console.error('Error fetching data:', error); // 오류가 발생하면 콘솔에 출력
      });
  }, []);

  return (
    <div className="App">
      {data ? (
        <ul>
          {data.members.map(member => ( // data.members 배열을 순회하며 각 멤버를 목록으로 렌더링
            <div key={member.id}>{member.name}</div> // 각 멤버의 이름을 목록 항목으로 출력
          ))}
        </ul>
      ) : (
        <p>Loading...</p> // 데이터가 로드되기 전에는 로딩 메시지를 출력
      )}
    </div>
  );
}

export default FlaskData;

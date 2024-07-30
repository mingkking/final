import React from "react";
import MainImg from "./MainImg";
import '../mainCss/MainUnder.css'; // CSS 파일을 import 합니다

const MainUnder = () => {
  // 이미지 URL, 명언, 인물 이름 배열을 정의합니다
  const images = [
    {
      src: "https://i.namu.wiki/i/kWsfvMXLrk01RVDmrLFQ5LvQw_TgZ5YfS4Lyys_CETiwo7TMGNXirRbNnhhGpBdlAgqWw4fYRS3ka5MJd9Bd4g.webp",
      quote: "10년 이상을 볼것이 아니면 10분도 갖고있지 말라!",
      name: "워렌 버핏"
    },
    {
      src: "https://img1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/d2vw/image/Jp6Lq3fRUb-xMlWhMKXL90CVxxw.jpg",
      quote: "우선 시장에서 살아남고 그 다음에 돈을 벌어라",
      name: "조지 소로스"
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Web_Summit_2018_-_Forum_-_Day_2%2C_November_7_HM1_7481_%2844858045925%29.jpg",
      quote: "배우는 것이 많아질수록 모르는 것이 늘어난다",
      name: "레이 달리오"
    },
    {
      src: "https://mblogthumb-phinf.pstatic.net/MjAyMDAxMDdfMzAw/MDAxNTc4MzgxMDE2MDQ3.0qs7hgMZwunRNaOuJBzHNcIvV7bYaK0Uud4ULrKYxGgg.Aw1duSzyZ3scwRHdmHWPWpaHRxDuFSpiEbJ99EZoddEg.PNG.jeunkim/image.png?type=w800",
      quote: "이론상 영원히 존재할 수 있는 기업에 투자하라",
      name: "빌 애크먼"
    },
    {
      src: "https://cphoto.asiae.co.kr/listimglink/1/2012012218260437380_1.jpg",
      quote: "성공 전략은 '남들과 반대로' 하는 것",
      name: "앙드레 코스톨라니"
    },
    {
      src: "https://m.segye.com/content/image/2012/07/24/20120724022479_0.jpg",
      quote: "당황하지 마십시오 매도 할 시간은 폭락 후가 아니라 폭락 전입니다",
      name: "존 템플턴"
    }
  ];

  return (
    <div className="main-under-container">
      <h5 className="title">억만장자들의 명언</h5>
      <div className="main-img-container">
        {images.map((img, index) => (
          <MainImg 
            key={index} 
            src={img.src} 
            alt={`Example ${index + 1}`} 
            quote={img.quote} 
            name={img.name}
          />
        ))}
      </div>
    </div>
  );
};

export default MainUnder;

import { useState } from "react";
import "./Share.css"

const Share = ({ post }) => {
  const [isShare, setIsShare] = useState(false);

  const shareKakao = () => {

    window.Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: post.title,
        description: post.contents,
        imageUrl: `http://localhost:8080/uploads/${post.image_path}`, // 이미지 URL
        link: {
          mobileWebUrl: `http://localhost:3000/DetailCommunity?id=${post.id}`,
          webUrl: `http://localhost:3000/DetailCommunity?id=${post.id}`,
        },
      },
      buttons: [
        {
          title: '웹으로 보기',
          link: {
            mobileWebUrl: `http://localhost:3000/DetailCommunity?id=${post.id}`,
            webUrl: `http://localhost:3000/DetailCommunity?id=${post.id}`,
          },
        },
      ],
    });

  };

  const copyToClipboard = () => {
    const link = `http://localhost:3000/DetailCommunity?id=${post.id}`;
    navigator.clipboard.writeText(link).then(() => {
      alert('링크가 복사되었습니다!', `http://localhost:3000/DetailCommunity?id=${post.id}`);
    }, (err) => {
      alert('링크 복사 실패: ', err);
    });
  }

  return (
    <div className='post-item-share' onClick={() => {
      setIsShare(!isShare);
    }}>
      <svg xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M18 16.08C17.24 16.08 16.56 16.38 16.05 16.88L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L15.96 7.19C16.5 7.69 17.21 8 18 8C19.66 8 21 6.66 21 5C21 3.34 19.66 2 18 2C16.34 2 15 3.34 15 5C15 5.24 15.04 5.47 15.09 5.7L8.04 9.81C7.5 9.31 6.79 9 6 9C4.34 9 3 10.34 3 12C3 13.66 4.34 15 6 15C6.79 15 7.5 14.69 8.04 14.19L15.16 18.36C15.11 18.58 15.08 18.79 15.08 19C15.08 20.66 16.42 22 18.08 22C19.74 22 21.08 20.66 21.08 19C21.08 17.34 19.74 16 18.08 16H18V16.08Z" />
      </svg>
      {
        isShare && (
          <ul>
            <li style={{ listStyle: "none" }} onClick={shareKakao}>
              <svg width="42" height="42" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className='post-item-share'>
                <path d="M12 2C6.48 2 2 5.58 2 10c0 2.61 1.7 4.91 4.3 6.3L5 21l5.19-2.73C10.79 18.91 11.39 19 12 19c5.52 0 10-3.58 10-8s-4.48-8-10-8zM7.5 11h-2v-2h2v2zm7.5 0h-2v-2h2v2zm5-2h-2v2h2v-2zm-5 3.91c-1.35 0-2.64-.45-3.62-1.18l-1.42 1.41C7.88 14.8 9.89 15.5 12 15.5c3.31 0 6-2.01 6-4.5h-2c0 1.38-1.79 2.5-4 2.5z" />
              </svg>
            </li>
            <li style={{ listStyle: "none" }} onClick={copyToClipboard}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='post-item-share'>
                <path d="M6.12 12.74l-1.41 1.41a4 4 0 005.66 5.66l11.31-11.31a4 4 0 00-5.66-5.66l-1.41 1.41a2 2 0 00-2.83 2.83l-7.07 7.07a2 2 0 00-2.83 2.83zM11 11l7-7" />
              </svg>
            </li>
          </ul>
        )
      }

    </div>
  );
}

export default Share;
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import CommunityContext from "../../contexts/CommunityContext";
import axios from "axios";

const Bookmark = (props) => {
  const communityValue = useContext(CommunityContext);
  const navigate = useNavigate();
  const [isBookmark, setIsBookmark] = useState(false);
  const bookmarkList = communityValue.state.selectAllBookmark || [];

  useEffect(() => {

    let liked = false;

    if (bookmarkList.length > 0) {
      bookmarkList.map((bookmark, i) => {
        if (bookmark.id.id === props.postId && bookmark.user_num.userNum === communityValue.state.userNum) {
          liked = true;
        }
      });
    }

    setIsBookmark(liked);
    
  }, [communityValue.state.selectAllBookmark, props.postId, communityValue.state.userNum]);

  const bookmarkBtn = () => {
    setIsBookmark(!isBookmark);
    bookPro();
  }

  const bookPro = async () => {
    const bookmark = {
        user_num: { userNum: communityValue.state.userNum },
        id: { id: props.postId },
    }
    if (!isBookmark) {
        axios.post("http://localhost:8080/insertBookmark", bookmark) // 데이터 -> 컨트롤러 요청
    } else {
        axios.post("http://localhost:8080/deleteBookmark", bookmark) // 데이터 -> 컨트롤러 요청
    }

}

  return (
    <div className='post-item-bookmark'>

      {isBookmark ?
        <button className='community-insertBtn' onClick={bookmarkBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
            <path d="M19 3H5a2 2 0 0 0-2 2v18l7-5 7 5V5a2 2 0 0 0-2-2z" />
          </svg>
        </button>
        :
        <button className='community-insertBtn' onClick={bookmarkBtn}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bookmark">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </button>
      }
    </div>

  );
}

export default Bookmark;
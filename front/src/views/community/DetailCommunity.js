import "./Community.css"
import PopularPosts from "./components/PopularPosts/PopularPosts";
import { useContext, useEffect } from "react";
import axiosInstance from "../login/component/Token/axiosInstance";
import CommunityContext from "./contexts/CommunityContext";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import DetailPost from "./components/DetailPost/DetailPost";
import { useSearchParams } from "react-router-dom";

const DetailCommunity = () => {

    const communityValue = useContext(CommunityContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    let popularGetId = searchParams.get('id');
    let postId = location.state?.id;

    useEffect(() => {                                                       // 처음 한번 실행하는 훅

        loginCheck();                                                       // 로그인 판단 함수 실행
        selectOnePost(postId);
        selectAllUserLike();                                                // 커뮤니티 모든 글 좋아요 검색 함수 실행
        selectAllPopularPosts();                                            // 커뮤니티 모든 인기 글 검색 함수 실행
        selectAllBookmark();                                                // 커뮤니티 모든 글 북마크 검색 함수 실행
        selectAllReply(postId);                                             // 커뮤니티 모든 댓글 검색 함수 실행
        selectAllReReply();                                                 // 커뮤니티 모든 대댓글 검색 함수 실행

        const intervalId = setInterval(() => {
            communityValue.actions.setRealTime(new Date().toLocaleString());
            selectAllPopularPosts();  // 커뮤니티 모든 인기 글 검색 함수 실행
        }, 10000);  // 60초마다 실행

        // Cleanup function to clear the interval when the component is unmounted
        return () => clearInterval(intervalId);

    }, []);

    useEffect(() => {
        if (popularGetId !== null && popularGetId !== undefined) {
            selectOnePost(popularGetId);
            selectAllReply(popularGetId);
        }
    }, [popularGetId]);

    useEffect(() => {
        if (postId !== null && postId !== undefined) {
            selectOnePost(postId);
            selectAllReply(postId);
        }
    }, [postId]);

    const loginCheck = async () => {                                        // 로그인 판단 함수 생성

        const response = await axiosInstance.get('/check-login-status', {   // 로그인 상태 요청
            withCredentials: true,                                          // 쿠키 포함 요청
        });

        if (response.data.isLoggedIn !== true) {                            // 로그인이 되어 있지 않을 경우
            alert("로그인 및 구독 후 이용해주세요!");                         // 로그인 또는 구독 하라고 하는 경고창 띄우기
            navigate("/login");                                             // 로그인 화면으로 이동시키기
        } else {
            communityValue.actions.setUserNick(response.data.userNickname); // 로그인 닉네임 저장
            communityValue.actions.setUserNum(response.data.userNum);       // 로그인 유저 프라이머리 키 저장
        }

    }

    const selectOnePost = async (postId) => {                                    // 커뮤니티 모든 글 검색 함수 생성

        await axios.get("http://localhost:8080/selectOneCommunity", { params: { id: postId } })            // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 입력 요청 후 응답
                communityValue.actions.setSelectOnePost(res.data);          // 커뮤니티 모든 글 검색 데이터 저장
            })

    }

    const selectAllUserLike = async () => {                                 // 커뮤니티 모든 글 좋아요 검색 함수 생성
        await axios.get("http://localhost:8080/selectAllUserLike")            // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 검색 요청 후 응답     
                communityValue.actions.setSelectAllUserLike(res.data);         // 커뮤니티 모든 글 좋아요 검색 데이터 저장
            })
    }

    const selectAllPopularPosts = async () => {                             // 커뮤니티 모든 인기 글 검색 함수 생성

        await axios.get("http://localhost:8080/selectPopularCommunity")     // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 검색 요청 후 응답
                communityValue.actions.setSelectAllPopularPosts(res.data);  // 커뮤니티 모든 인기 글 검색 데이터 저장
            })

    }

    const selectAllBookmark = async () => {                                 // 커뮤니티 모든 글 북마크 검색 함수 생성
        await axios.get("http://localhost:8080/selectAllBookmark")          // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 검색 요청 후 응답     
                communityValue.actions.setSelectAllBookmark(res.data);      // 커뮤니티 모든 글 북마크 검색 데이터 저장
            })
    }

    const selectAllReply = async (postId) => {                                    // 커뮤니티 모든 댓글 검색 함수 생성
        await axios.get("http://localhost:8080/selectAllReply", { params: { id: postId } }) // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 검색 요청 후 응답
                communityValue.actions.setSelectAllReply(res.data);         // 커뮤니티 모든 댓글 검색 데이터 저장
            })
    }

    const selectAllReReply = async (reply_num) => {                                    // 커뮤니티 모든 대댓글 검색 함수 생성
        await axios.get("http://localhost:8080/selectAllReReply") // 검색 -> 컨트롤러 요청

            .then((res) => {                                                // DB 검색 요청 후 응답
                communityValue.actions.setSelectAllReReply(res.data);         // 커뮤니티 모든 대댓글 검색 데이터 저장
            })
    }

    return (
        <div className="container" style={{ margin: "50px auto" }}>
            <div className="row">

                <div className="post col-lg-8 col-md-12">
                    <DetailPost />
                </div>

                <div className="popular col-lg-4 col-md-12">

                    <div className="row" style={{ width: "100%" }}>
                        <PopularPosts />
                    </div>

                </div>

            </div>
        </div>
    )

}

export default DetailCommunity;
import "./Community.css"
import Posts from "./components/Posts/Posts";
import PopularPosts from "./components/PopularPosts/PopularPosts";
import { useContext, useEffect } from "react";
import axiosInstance from "../login/component/Token/axiosInstance";
import CommunityContext from "./contexts/CommunityContext";
import { useNavigate } from "react-router";
import InsertPost from "./components/InsertPost/InsertPost";

const InsertCommunity = () => {

    const communityValue = useContext(CommunityContext);
    const navigate = useNavigate();

    useEffect(() => {                                                                    // 처음 한번 실행하는 훅

        loginCheck();                                                                    // 로그인 판단 함수 실행

    }, []);

    const loginCheck = async () => {                                                     // 로그인 판단 함수 생성

        const response = await axiosInstance.get('/check-login-status', {                // 로그인 상태 요청
            withCredentials: true,                                                       // 쿠키 포함 요청
        });
        
        if (response.data.isLoggedIn === true) {                                          // 로그인이 되어 있을 경우
            communityValue.actions.setUserNum(response.data.userNum);                     // 유저 아이디 저장
        } else {                                                                          // 로그인이 되어 있지 않을 경우
            alert("로그인 및 구독 후 이용해주세요!");                                       // 로그인 또는 구독 하라고 하는 경고창 띄우기
            navigate("/login");                                                           // 로그인 화면으로 이동시키기
        }

    }

    return (
        <div className="container" style={{ margin: "50px auto" }}>
            <div className="row">

                <div className="post col-lg-8 col-md-12">
                    <InsertPost />
                </div>

            </div>
        </div>
    )

}

export default InsertCommunity;
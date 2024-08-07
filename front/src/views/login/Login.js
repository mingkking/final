import { useContext, useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosInstance from './component/Token/axiosInstance';

import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import LoginContext from "./contexts/LoginContext";




function Login({ onLoginSuccess }) {
    const { state, actions } = useContext(LoginContext);
    
    const [userId, setUserId] = useState('');
    const [userPass, setUserPass] = useState('');
    const navigate = useNavigate();

    const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    
  
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            // 로그인 요청을 서버에 보내는 POST 요청
            const response = await axiosInstance.post('/login', {
                userId: userId,
                userPass: userPass
            });
            

            // 로그인 성공 시 로그인 상태 업데이트
            if (onLoginSuccess) {
                // onLoginSuccess 콜백 호출하여 userNickname 전달
                onLoginSuccess(response.data.userNickname);
            }

            console.log('Setting userId:', response.data.userId);
            actions.setUserId(response.data.userId);
            actions.setAfterLoginNick(response.data.userNickname);
            console.log('Login response data:', response.data);

             // 프로필 이미지 URL 업데이트
             if (response.data.profileImageUrl) {
                actions.setProfileImage(`http://localhost:8080${response.data.profileImageUrl}`);
            }
 
            alert("로그인 성공")
            // 메인 페이지로 이동
            navigate('/');  
        } catch (error) {
            console.error('Error during login:', error);
            alert('로그인 실패 ' + error.response?.data || '아이디 및 비밀번호가 일치하지 않습니다.');
            
        }
    };

    useEffect(() => {
        console.log('GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
      }, [GOOGLE_CLIENT_ID]);

    //구글 로그인
    const handleGoogleLoginSuccess = async (response) => {
        const idToken = response.credential;
        try {
            const result = await axiosInstance.post('/google-login', { idToken });
            const userNickname = result.data.userNickname;
            const profileImageUrl = result.data.profileImageUrl;
            actions.setUserId(result.data.userId);
            actions.setAfterLoginNick(userNickname);

             // 프로필 이미지 URL 업데이트
             if (profileImageUrl) {
                const fullProfileImageUrl =  profileImageUrl.startsWith('http') ? profileImageUrl : `http://localhost:8080${profileImageUrl}`;
                actions.setProfileImage(fullProfileImageUrl);
                console.log('Profile image URL set to:', fullProfileImageUrl);
            }else {
                actions.setProfileImage('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
            }

            alert("구글 로그인 성공");
            navigate("/");
        } catch (error) {
            console.error("Google 로그인 실패:", error);
            alert('Google 로그인 실패');
        }
    };

    const handleGoogleLoginError = (error) => {
        console.error("Google 로그인 실패:", error);
        alert('Google 로그인 실패');
    };
    
  
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <div className="login-container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="login-box p-4 border rounded bg-light">
                            <h2 className="login-title text-center mb-4">로그인</h2>
                            <form onSubmit={handleLogin}>
                                <div className="login-form-group mb-3">
                                    <label htmlFor="userId">아이디</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="userId"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="login-form-group mb-4">
                                    <label htmlFor="userPass">비밀번호</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="userPass"
                                        value={userPass}
                                        onChange={(e) => setUserPass(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="login-button btn-block mb-3">로그인</button>
                                <hr className="login-hr" />
                                <div className="login-google-container">
                                    <GoogleLogin
                                        onSuccess={handleGoogleLoginSuccess}
                                        onFailure={handleGoogleLoginError}
                                        prompt="select_account"
                                    >
                                        구글 로그인
                                    </GoogleLogin>
                                </div>
                            </form>
                        </div>
                        <div className="login-link-container mb-4">
                            <a href="/Join" className="btn btn-link">회원가입</a>
                            |
                            <a href="/IdFind" className="btn btn-link">아이디 찾기</a>
                            |
                            <a href="/PwFind" className="btn btn-link">비밀번호 재설정</a>
                        </div>
                    </div>
                </div>
            </div>
        </GoogleOAuthProvider>
    );
}

  
  export default Login;
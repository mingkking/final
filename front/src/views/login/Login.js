import { useContext, useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"
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
            actions.setUserId(result.data.userId);
            actions.setAfterLoginNick(userNickname);
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
        <div className="login-container">
            <div className="login-box">
                <h2>로그인</h2>
                <form onSubmit={handleLogin}>
                <div className="input-container">                    
                    <p>아이디</p>                    
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} required />                    
                </div>
                <div className="input-container">                    
                    <p>비밀번호 </p>                   
                    <input type="password" value={userPass} onChange={(e) => setUserPass(e.target.value)} required />
                </div>  
                <div className="link-container">
                    <a href="/Join">회원가입</a>
                    |
                    <a href="/IdFind">아이디 찾기</a>
                    |
                    <a href="/PwFind">비밀번호 재설정</a>
                </div>
                    <button type="submit" className="login-button">로그인</button>
                    <hr/>
                    <hr/>
                    <div className="google-login-button">               
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
        </div>
        </GoogleOAuthProvider>
    );
  }
  
  export default Login;
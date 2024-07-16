import { useEffect,useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"
import axiosInstance from './component/Token/axiosInstance';



function Login({ onLoginSuccess }) {
    const [userId, setUserId] = useState('');
    const [userPass, setUserPass] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            // 로그인 요청을 서버에 보내는 POST 요청
            const response = await axiosInstance.post('/login', {
                userId: userId,
                userPass: userPass
            });

            // 액세스 토큰을 로컬 스토리지에 저장
            localStorage.setItem('accessToken', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);

           

            // 로그인 성공 시 로그인 상태 업데이트
            if (onLoginSuccess) {
                // onLoginSuccess 콜백 호출하여 userNickname 전달
                onLoginSuccess(response.data.userNickname);
            }

            // 메인 페이지로 이동
            navigate('/');  
        } catch (error) {
            console.error('Error during login:', error);
            alert('로그인 실패 ' + error.response?.data || 'An error occurred');
            
        }
    };
  
    return (
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
                    <a href="#">아이디 찾기</a>
                    |
                    <a href="#">비밀번호 재설정</a>
                </div>
                    <button type="submit" className="login-button">로그인</button>
                    <hr/>
                    <hr/>
                    <button type="button" className="kakao-login">카카오 로그인</button>
                    <button type="button" className="google-login">구글 로그인</button>
               
                </form>
            </div>
        </div>
    );
  }
  
  export default Login;
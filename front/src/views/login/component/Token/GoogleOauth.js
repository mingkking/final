import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GoogleOAuth2RedirectPage.module.css";

function GoogleOAuth2RedirectPage() {
    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code");

    const getToken = async (code) => {
        const REST_API_KEY = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
        const SECRET_KEY = process.env.REACT_APP_GOOGLE_SECRET_KEY;

        try {
            const response = await fetch(`https://oauth2.googleapis.com/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: REST_API_KEY,
                    redirect_uri: REDIRECT_URI,
                    client_secret: SECRET_KEY,
                    code: code,
                }),
            });

            if (!response.ok) {
                throw new Error('토큰 요청에 실패했습니다.');
            }

            return response.json();
        } catch (error) {
            console.error("토큰 요청 중 오류가 발생했습니다: ", error);
        }
    };

    useEffect(() => {
        if (code) {
            getToken(code).then((res) => {
                if (res && res.access_token) {
                    console.log(res.access_token);
                    // Access token을 이용해 사용자 정보를 가져오거나 추가 작업을 수행할 수 있습니다.
                    navigate('/'); // 원하는 페이지로 리디렉션
                } else {
                    console.error("access_token이 없습니다.", res);
                }
            });
        }
    }, [code, navigate]);
    
      return <div className={styles.container} >
        <div className={styles.spinner} />
      </div>
}

export default GoogleOAuth2RedirectPage;
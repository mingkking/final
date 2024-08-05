import { createContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

const LoginContext = createContext();
// 생성자
const LoginProvider = (props) => {

	// const [afterLoginNick, setAfterLoginNick] = useState("");
	// const [profileImage, setProfileImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
	// const [userId, setUserId] = useState("");

	const [afterLoginNick, setAfterLoginNick] = useState(Cookies.get('afterLoginNick') || "");
	const [profileImage, setProfileImage] = useState(Cookies.get('profileImage') || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
	const [userId, setUserId] = useState(Cookies.get('userId') || "");

  useEffect(() => {
    Cookies.set('afterLoginNick', afterLoginNick, { expires: 1 / 24}); // 쿠키 만료일 설정
  }, [afterLoginNick]);

  useEffect(() => {
    Cookies.set('profileImage', profileImage, { expires: 1 / 24 });
  }, [profileImage]);

  useEffect(() => {
    Cookies.set('userId', userId, { expires: 1 / 24 });
  }, [userId]);

	

	const values = {
		state: { afterLoginNick, profileImage, userId },
		actions: { setAfterLoginNick, setProfileImage, setUserId} 
	}
 
	return (
		<LoginContext.Provider value={values}>
			{props.children}
		</LoginContext.Provider>
	);
}

export { LoginProvider };
export default LoginContext;
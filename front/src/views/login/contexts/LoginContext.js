import { createContext, useState } from "react";
const LoginContext = createContext();
// 생성자
const LoginProvider = (props) => {

	const [afterLoginNick, setAfterLoginNick] = useState("");
	const [profileImage, setProfileImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");

	const values = {
		state: { afterLoginNick, profileImage },
		actions: { setAfterLoginNick, setProfileImage} 
	}

	return (
		<LoginContext.Provider value={values}>
			{props.children}
		</LoginContext.Provider>
	);
}

export { LoginProvider };
export default LoginContext;
import { createContext, useState } from "react";
const LoginContext = createContext();
// 생성자
const LoginProvider = (props) => {

	const [afterLoginNick, setAfterLoginNick] = useState("");

	const values = {
		state: { afterLoginNick },
		actions: { setAfterLoginNick } 
	}

	return (
		<LoginContext.Provider value={values}>
			{props.children}
		</LoginContext.Provider>
	);
}

export { LoginProvider };
export default LoginContext;
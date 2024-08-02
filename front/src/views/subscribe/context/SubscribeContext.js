import { createContext, useState } from "react";


const SubscribeContext = createContext();

// 생성자
const SubscribeProvider = (props) => {

	const [userNum, setUserNum] = useState(null);


	const values = {
		state: { userNum },
		actions: { setUserNum } 
	}

	return (
		<SubscribeContext.Provider value={values}>
			{props.children}
		</SubscribeContext.Provider>
	);
}

export { SubscribeProvider };
export default SubscribeContext;
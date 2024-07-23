import { createContext, useState } from "react";
const CommunityContext = createContext();
// 생성자
const CommunityProvider = (props) => {

	const values = {
		state: {  },
		actions: {  } 
	}

	return (
		<CommunityContext.Provider value={values}>
			{props.children}
		</CommunityContext.Provider>
	);
}

export { CommunityProvider };
export default CommunityContext;
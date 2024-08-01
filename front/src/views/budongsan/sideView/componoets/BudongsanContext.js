import { createContext, useState } from "react";
const BudongsanContext = createContext();

const BudongsanProvider = (props) => {
    const [userNum, setUserNum] = useState(null);


    const values = {
		state: { userNum },
		actions: { setUserNum } 
	}

    return (
        <BudongsanContext.Provider value={values}>
            {props.children}
        </BudongsanContext.Provider>
    );

}

export {BudongsanProvider};
export default BudongsanContext;
import { Button, Input } from "@mui/material";
import { useState } from "react";
import "./InputField.css";

const InputField = ({message, setMessage, sendMessage}) => {

    return (
        // 입력 필드 영역
        <div className="input-area" style={{margin:"0px", padding: "0px", borderRadius: "10px"}}>

            {/* 입력 필드 form 태그 */}
            <form onSubmit={sendMessage} className="input-container">

                {/* 입력 필드 태그 */}
                <Input
                    placeholder="Type in here.."
                    value={message}
                    onChange={(event)=> setMessage(event.target.value)}
                    multiline={false}
                    rows={1}
                ></Input>
                {/* 입력 필드 태그 */}

                {/* 입력 버튼 */}
                <Button
                    disabled={message === ""}
                    type="submit"
                    className="send-button"
                >
                    <img src="https://www.therich.io/images/icons/send.svg"></img>
                </Button>
                {/* 입력 버튼 */}
                
            </form>
            {/* 입력 필드 form 태그 */}

        </div>
        // 입력 필드 영역
    );
}

export default InputField;
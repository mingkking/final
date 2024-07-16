import { Button, Input } from "@mui/material";
import { useState } from "react";
import "./InputField.css";

const InputField = ({message, setMessage, sendMessage}) => {

    return (
        <div className="input-area" style={{margin:"0px", padding: "0px", borderRadius: "10px"}}>
            <form onSubmit={sendMessage} className="input-container">
                <Input
                    placeholder="Type in here.."
                    value={message}
                    onChange={(event)=> setMessage(event.target.value)}
                    multiline={false}
                    rows={1}
                ></Input>
                <Button
                    disabled={message === ""}
                    type="submit"
                    className="send-button"
                >
                    <img src="https://www.therich.io/images/icons/send.svg"></img>
                </Button>
            </form>
        </div>
    );
}

export default InputField;
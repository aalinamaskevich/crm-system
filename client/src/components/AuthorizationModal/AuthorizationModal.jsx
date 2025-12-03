import "./style.css";
import React, { useState } from "react";
import {Modal} from 'react-bootstrap';
import SignInContent from "./components/SignInContent/SignInContent";
import SignUpContent from "./components/SignUpContent/SignUpContent";
import CheckKeyContent from "./components/CheckKeyContent/CheckKeyContent";

function AuthorizationModal({show, onHide}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [state, setState] = useState("signIn");

    const renderStateContent = () =>{
        if(state === "signIn")
            return <SignInContent setState={setState} onHide={onHide}/>
        else if(state === "signUp")
            return <SignUpContent setState={setState} setParentUsername={setUsername} setParentPassword={setPassword}/>
        else if(state === "checkKey")
            return <CheckKeyContent setState={setState} username={username} password={password}/>
        return <></>
    }

    return (
        <Modal show onHide={onHide}>
            {renderStateContent()}
        </Modal>
    );
}

export default AuthorizationModal;
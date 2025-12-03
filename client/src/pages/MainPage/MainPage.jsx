import './style.css'
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { storage } from "../../config";
import SignInContent from "./components/SignInContent/SignInContent";
import SignUpContent from "./components/SignUpContent/SignUpContent";
import CheckKeyContent from "./components/CheckKeyContent/CheckKeyContent";

const MainPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (storage.getItem('role') === 'ADMIN') {
            navigate('/users')
        }
        else if (storage.getItem('role') === 'USER') {
            navigate('/categories')
        }
    }, []);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [state, setState] = useState("signIn");

    const renderStateContent = () => {
        if (state === "signIn")
            return <SignInContent setState={setState}/>
        else if (state === "signUp")
            return <SignUpContent setState={setState} setParentUsername={setUsername} setParentPassword={setPassword} />
        else if (state === "checkKey")
            return <CheckKeyContent setState={setState} username={username} password={password} />
        return <></>
    }

    return renderStateContent();
}

export default MainPage;
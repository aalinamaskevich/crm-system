import "./style.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container, FloatingLabel } from 'react-bootstrap';
import { storage, API_BASE_URL } from "../../../../config";

function SignInContent({ setState }) {
    const [isUsernameInvalid, setUsernameInvalid] = useState(false);
    const [usernameLabel, setUsernameLabel] = useState("Эл.почта");

    const [isPasswordInvalid, setPasswordInvalid] = useState(false);
    const [passwordLabel, setPasswordLabel] = useState("Пароль");

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

const navigate = useNavigate();

    const onSignIn = async () => {
        let isInvalid = username.length === 0 || password.length === 0;

        setUsernameInvalid(username.length === 0);
        setUsernameLabel(username.length === 0 ? "Ввод почты обязателен!" : "Эл.почта");

        setPasswordInvalid(password.length === 0);
        setPasswordLabel(password.length === 0 ? "Ввод пароля обязателен!" : "Пароль");

        if (isInvalid)
            return;

        isInvalid = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username));
        setUsernameInvalid(isInvalid);
        setUsernameLabel(isInvalid ? "Некорректный ввод!" : "Эл.почта");

        if (isInvalid)
            return;

        const url = API_BASE_URL + "account/login";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password
                }),
            });

            const responseData = await response.json();

            if (!!responseData.role) {
                storage.setItem('token', responseData.token);
                storage.setItem('id', responseData.id);
                storage.setItem('username', responseData.username);
                storage.setItem('role', responseData.role);
                window.dispatchEvent(new Event('storage'));
                navigate(responseData.role === "ADMIN" ? '/users' : '/categories');
            }
            else if (responseData.keyword === "USERNAME") {
                setUsernameInvalid(true);
                setUsernameLabel("Аккаунта не существует!");
            }
            else if (responseData.keyword === "ACTIVE") {
                setUsernameInvalid(true);
                setUsernameLabel("Аккаунт заблокирован!");
            }
            else {
                setPasswordInvalid(true);
                setPasswordLabel("Неверный пароль!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            <Row className="justify-content-center mt-5">
                <Col className="col-6 border border-3 border-primary rounded-5">
                    <Row className="justify-content-center">
                        <p className="fs-3 fw-bold text-center">Вход</p>
                    </Row>
                    <Row>
                        <FloatingLabel controlId="floatingUsername" isInvalid={isUsernameInvalid} label={usernameLabel}>
                            <Form.Control isInvalid={isUsernameInvalid} type="email" placeholder="name@example.com" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </FloatingLabel>
                    </Row>

                    <Row className="mt-1">
                        <FloatingLabel controlId="floatingPassword" isInvalid={isPasswordInvalid} label={passwordLabel} className="mt-3">
                            <Form.Control isInvalid={isPasswordInvalid} type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FloatingLabel>
                    </Row>

                    <Row className="mt-3 mb-3 justify-content-center">

                        <Col className="col-4">
                            <Button variant="primary" className="col-12" onClick={onSignIn}>Войти</Button>
                        </Col>

                        <Col className="col-4">
                            <Button variant="primary" className="col-12" onClick={() => { setState("signUp") }}>Регистрация</Button>
                        </Col>

                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default SignInContent;
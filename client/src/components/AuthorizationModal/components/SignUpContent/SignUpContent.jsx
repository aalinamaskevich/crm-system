import "./style.css";
import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Container, FloatingLabel } from 'react-bootstrap';
import { API_BASE_URL } from "../../../../config";

function SignUpContent({ setState, setParentUsername, setParentPassword }) {
    const [isUsernameInvalid, setUsernameInvalid] = useState(false);
    const [usernameLabel, setUsernameLabel] = useState("Эл.почта");

    const [isPasswordInvalid, setPasswordInvalid] = useState(false);
    const [passwordLabel, setPasswordLabel] = useState("Пароль");

    const [isRepeatInvalid, setRepeatInvalid] = useState(false);
    const [repeatLabel, setRepeatLabel] = useState("Повтор пароля");

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeat, setRepeat] = useState('');

    const onSignUp = async () => {
        let isInvalid = username.length === 0 || password.length === 0 || repeat.length === 0;

        setUsernameInvalid(username.length === 0);
        setUsernameLabel(username.length === 0 ? "Ввод почты обязателен!" : "Эл.почта");

        setPasswordInvalid(password.length === 0);
        setPasswordLabel(password.length === 0 ? "Ввод пароля обязателен!" : "Пароль");

        setPasswordInvalid(repeat.length === 0);
        setPasswordLabel(repeat.length === 0 ? "Ввод пароля обязателен!" : "Повтор пароля");

        if (isInvalid)
            return;

        isInvalid = !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username));
        setUsernameInvalid(isInvalid);
        setUsernameLabel(isInvalid ? "Некорректный ввод!" : "Эл.почта");

        if (isInvalid)
            return;

        isInvalid = password !== repeat;
        setPasswordInvalid(isInvalid);
        setPasswordLabel(isInvalid ? "Пароли должны совпадать!" : "Пароль");
        setRepeatInvalid(isInvalid);
        setRepeatLabel(isInvalid ? "Пароли должны совпадать!" : "Повтор пароля");

        if (isInvalid)
            return;

        const url = API_BASE_URL + "account/signup";

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

            if (!responseData.keyword) {
                setParentUsername(username);
                setParentPassword(password);
                setState("checkKey");
            }
            else if (responseData.keyword === "USERNAME") {
                setUsernameInvalid(true);
                setUsernameLabel("Аккаунт уже существует!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Регистрация</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-white-50">
                <Form>
                    <Container>
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

                        <Row className="mt-1">
                            <FloatingLabel controlId="floatingRepeat" isInvalid={isRepeatInvalid} label={repeatLabel} className="mt-3">
                                <Form.Control isInvalid={isRepeatInvalid} type="password" placeholder="password" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
                            </FloatingLabel>
                        </Row>

                        <Row className="mt-3 justify-content-start">

                            <Col className="col-auto">
                                <Button variant="primary" className="button" onClick={onSignUp}>Регистрация</Button>
                            </Col>

                            <Col className="col-auto">
                                <Button onClick={() => { setState("signIn") }} variant="link">Уже есть аккаунт?</Button>
                            </Col>
                        </Row>

                    </Container>
                </Form>
            </Modal.Body>
        </>
    );
}

export default SignUpContent;
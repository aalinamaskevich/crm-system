import "./style.css";
import React, { useState } from "react";
import { Form, Button, Row, Col, Container, FloatingLabel } from 'react-bootstrap';
import { API_BASE_URL } from "../../../../config";

function CheckKeyContent({ setState, username, password }) {
    const [key, setKey] = useState("");

    const [isKeyInvalid, setKeyInvalid] = useState(false);
    const [keyLabel, setKeyLabel] = useState("Ключ регистрации");

    const onSignUp = async () => {
        let isInvalid = key.length === 0;

        setKeyInvalid(isInvalid);
        setKeyLabel(isInvalid ? "Ввод обязателен!" : "Ключ регистрации");

        if (isInvalid)
            return;

        const url = API_BASE_URL + "account/check-key";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    key
                }),
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                setState("signIn");
            }
            else if (responseData.keyword === "KEY") {
                setKeyInvalid(true);
                setKeyLabel("Некоррентный ключ!");
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
                        <p className="fs-3 fw-bold text-center">Регистрация</p>
                    </Row>
                    <Row>
                        <FloatingLabel controlId="floatingUsername" label="Эл. почта">
                            <Form.Control className="disabled" type="email" placeholder="name@example.com" value={username} />
                        </FloatingLabel>
                    </Row>

                    <Row className="mt-1">
                        <FloatingLabel controlId="floatingPassword" label="Пароль" className="mt-3">
                            <Form.Control className="disabled" type="password" placeholder="password" value={password} />
                        </FloatingLabel>
                    </Row>

                    <Row className="mt-1">
                        <FloatingLabel controlId="floatingRepeat" label="Повтор пароля" className="mt-3">
                            <Form.Control className="disabled" type="password" placeholder="password" value={password} />
                        </FloatingLabel>
                    </Row>

                    <Row className="mt-1">
                        <FloatingLabel controlId="floatingKey" isInvalid={isKeyInvalid} label={keyLabel} className="mt-3">
                            <Form.Control isInvalid={isKeyInvalid} type="text" placeholder="text" aria-describedby="keyHelpBlock" value={key} onChange={(e) => setKey(e.target.value)} />
                        </FloatingLabel>
                        <Form.Text id="keyHelpBlock" muted>
                            Вам на почту был выслан регистрационный ключ. Пожалуйста, введите его в поле выше.
                        </Form.Text>
                    </Row>

                    <Row className="mt-3 mb-3 justify-content-center">

                        <Col className="col-4">
                            <Button variant="primary" className="col-12" onClick={onSignUp}>Регистрация</Button>
                        </Col>

                        <Col className="col-4">

                        </Col>

                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default CheckKeyContent;
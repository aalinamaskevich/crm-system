import "./style.css";
import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Container, FloatingLabel } from 'react-bootstrap';
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
        <>
            <Modal.Header closeButton>
                <Modal.Title>Регистрация</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-white-50">
                <Form>
                    <Container>
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

                        <Row className="mt-3 justify-content-start">

                            <Col className="col-auto">
                                <Button variant="primary" className="button" onClick={onSignUp}>Отправить</Button>
                            </Col>
                        </Row>

                    </Container>
                </Form>
            </Modal.Body>
        </>
    );
}

export default CheckKeyContent;
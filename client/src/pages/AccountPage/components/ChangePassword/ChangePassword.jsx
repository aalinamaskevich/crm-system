import "./style.css";
import { Container, Row, Col, FloatingLabel, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { storage, API_BASE_URL } from "../../../../config";

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [repeat, setRepeat] = useState('');

    const [isOldPasswordInvalid, setOldPasswordInvalid] = useState(false);
    const [oldPasswordLabel, setOldPasswordLabel] = useState("Текущий пароль");

    const [isNewPasswordInvalid, setNewPasswordInvalid] = useState(false);
    const [newPasswordLabel, setNewPasswordLabel] = useState("Новый пароль");

    const [isRepeatInvalid, setRepeatInvalid] = useState(false);
    const [repeatLabel, setRepeatLabel] = useState("Повтор пароля");

    const onSave = async () => {
        let isInvalid = oldPassword.length === 0 || newPassword.length === 0 || repeat.length === 0;

        setOldPasswordInvalid(oldPassword.length === 0);
        setOldPasswordLabel(oldPassword.length === 0 ? "Ввод обязателен!" : "Текущий пароль");

        setNewPasswordInvalid(newPassword.length === 0);
        setNewPasswordLabel(newPassword.length === 0 ? "Ввод обязателен!" : "Новый пароль");

        setRepeatInvalid(repeat.length === 0);
        setRepeatLabel(repeat.length === 0 ? "Ввод обязателен!" : "Повтор пароля");

        if (isInvalid)
            return;


        isInvalid = newPassword === oldPassword;
        setNewPasswordInvalid(isInvalid);
        setNewPasswordLabel(isInvalid ? "Пароль должен быть новым!" : "Новый пароль");

        if (isInvalid)
            return;

        isInvalid = newPassword !== repeat;
        setNewPasswordInvalid(isInvalid);
        setNewPasswordLabel(isInvalid ? "Пароли должны совпадать!" : "Новый пароль");
        setRepeatInvalid(isInvalid);
        setRepeatLabel(isInvalid ? "Пароли должны совпадать!" : "Повтор пароля");

        if (isInvalid)
            return;

        try {
            const url = API_BASE_URL + "account/change-password";
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storage.getItem("token")}`,
                },
                body: JSON.stringify({
                    id: storage.getItem("id"),
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }),
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                setOldPassword("");
                setNewPassword("");
                setRepeat("");
                alert("Сохранено!");
            }
            else if (responseData.keyword === "ID") {
                console.error(responseData.message);
            }
            else if (responseData.keyword === "PASSWORD"){
                setOldPasswordInvalid(true);
                setOldPasswordLabel("Неверный пароль!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container className="mt-3">
            <Row className="justify-content-start">
                <Col className="col-auto">
                    <p className='fs-5 fw-bold'>Смена пароля:</p>
                </Col>
            </Row>
            <Row>
                <FloatingLabel controlId="floatingOldPassword" isInvalid={isOldPasswordInvalid} label={oldPasswordLabel}>
                    <Form.Control isInvalid={isOldPasswordInvalid} type="password" placeholder="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                </FloatingLabel>
            </Row>

            <Row className="mt-1">
                <FloatingLabel controlId="floatingNewPassword" isInvalid={isNewPasswordInvalid} label={newPasswordLabel} className="mt-3">
                    <Form.Control isInvalid={isNewPasswordInvalid} type="password" placeholder="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </FloatingLabel>
            </Row>

            <Row className="mt-1">
                <FloatingLabel controlId="floatingRepeat" isInvalid={isRepeatInvalid} label={repeatLabel} className="mt-3">
                    <Form.Control isInvalid={isRepeatInvalid} type="password" placeholder="password" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
                </FloatingLabel>
            </Row>

            <Row className="mt-3 mb-3">
                <Col className="col-auto">
                    <Button variant="primary" onClick={() => { onSave() }}>Сохранить</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ChangePassword;
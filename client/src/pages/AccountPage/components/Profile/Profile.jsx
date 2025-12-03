import "./style.css";
import { Container, Row, Col, FloatingLabel, Form, Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { storage, API_BASE_URL } from "../../../../config";

function Profile() {
    const [isTelephoneInvalid, setTelephoneInvalid] = useState(false);
    const [telephoneLabel, setTelephoneLabel] = useState("Контактный телефон");

    const [id, setId] = useState(null);
    const [surname, setSurname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [telephone, setTelephone] = useState('');

    const fetchProfile = async () => {
        try {
            const url = API_BASE_URL + "profile-info/account/" + storage.getItem("id");
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${storage.getItem("token")}`,
                }
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                setId(responseData._id);
                setFirstname(responseData.firstname);
                setSurname(responseData.surname);
                setLastname(responseData.lastname);
                setTelephone(responseData.telephone);
            }
            else if (responseData.keyword === "ACCOUNT_ID") {
                alert("Пожалуйста, заполните данные профиля!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onSave = async () => {
        let isInvalid = !!telephone && !(/^\+375\d{9}$/.test(telephone)) && telephone.length !== 0;
        setTelephoneInvalid(isInvalid);
        setTelephoneLabel(isInvalid ? "Некорректный ввод!" : "Контактный телефон");

        if (isInvalid)
            return;

        try {
            const url = API_BASE_URL + "profile-info";
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${storage.getItem("token")}`,
                },
                body: JSON.stringify({
                    id: id,
                    firstname: firstname,
                    surname: surname,
                    lastname: lastname,
                    telephone: telephone
                }),
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                setId(responseData.id);
                setFirstname(responseData.firstname);
                setSurname(responseData.surname);
                setLastname(responseData.lastname);
                setTelephone(responseData.telephone);
                alert("Сохранено!");
            }
            else if (responseData.keyword === "ID") {
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <Container className="mt-3">
            <Row className="justify-content-start">
                <Col className="col-auto">
                    <p className='fs-5 fw-bold'>Личный профиль:</p>
                </Col>
            </Row>
            <Row className="mt-3">
                <FloatingLabel controlId="floatingSurname" label="Фамилия">
                    <Form.Control type="text" placeholder="surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
                </FloatingLabel>
            </Row>
            <Row className="mt-3">
                <FloatingLabel controlId="floatingFirsname" label="Имя">
                    <Form.Control type="text" placeholder="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </FloatingLabel>
            </Row>
            <Row className="mt-3">
                <FloatingLabel controlId="floatingLastname" label="Отчество">
                    <Form.Control type="text" placeholder="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </FloatingLabel>
            </Row>
            <Row className="mt-3">
                <FloatingLabel controlId="floatingTelephone" isInvalid={isTelephoneInvalid} label={telephoneLabel}>
                    <Form.Control isInvalid={isTelephoneInvalid} type="tel" placeholder="+375123456789" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
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

export default Profile;
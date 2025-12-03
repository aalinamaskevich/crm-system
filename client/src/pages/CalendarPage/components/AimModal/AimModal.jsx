import "./style.css";
import { Modal, Row, Col, Form, Button } from "react-bootstrap";
import React, { useState } from 'react';
import { API_BASE_URL, storage } from '../../../../config';

function AimModal({ categoryId, onCloseModal }) {
    const [name, setName] = useState("");
    const [duration, setDuration] = useState("");
    const [count, setCount] = useState("");
    const [date, setDate] = useState("");

    const [isNameInvalid, setNameInvalid] = useState(false);
    const [isDurationInvalid, setDurationInvalid] = useState(false);
    const [isCountInvalid, setCountInvalid] = useState(false);
    const [isDateInvalid, setDateInvalid] = useState(false);

    function isInteger(value) {
        return /^\d+$/.test(value);
    }

    const onSave = async () => {
        let isInvalid = name.length === 0 || duration.length === 0 || count.length === 0 || date.length === 0;

        setNameInvalid(name.length === 0);
        setDurationInvalid(duration.toString().length === 0);
        setCountInvalid(count.toString().length === 0);
        setDateInvalid(date.toString().length === 0);

        if (isInvalid)
            return;

        isInvalid = !isInteger(duration) || duration <= 0;

        setDurationInvalid(isInvalid);

        if (isInvalid)
            return;

        isInvalid = !isInteger(count) || count < 0;

        setCountInvalid(isInvalid);

        if (isInvalid)
            return;

        const url = API_BASE_URL + "aims";
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    duration: duration,
                    count: count,
                    categoryId: categoryId,
                    date: new Date(date)
                }),
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                onCloseModal(true);
            }
            else if (responseData.keyword === "CATEGORY_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
            else {
                console.error(responseData);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal show="true" onHide={() => { onCloseModal(false); }}>
            <Modal.Header closeButton>
                <Modal.Title>Добавление</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Form.Control isInvalid={isNameInvalid} value={name} type="text" placeholder="Название" onChange={(e) => setName(e.target.value)} />
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Control isInvalid={isDurationInvalid} value={duration} type="text" placeholder="Периодичность в днях" onChange={(e) => setDuration(e.target.value)} />
                    </Col>

                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Control isInvalid={isCountInvalid} value={count} type="text" placeholder="Количество событий (0 - бесконечно)" onChange={(e) => setCount(e.target.value)} />
                    </Col>

                </Row>
                <Row className="mt-3">
                    <Col>
                        <Form.Control isInvalid={isDateInvalid} value={date} min={new Date().toISOString().split("T")[0]} type="date" placeholder="Дата начала" onChange={(e) => setDate(e.target.value)} />
                    </Col>

                </Row>
                <Row className='mt-4 justify-content-start'>
                    <Button className='col-auto btn-primary ms-3' onClick={onSave}>Сохранить</Button>
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default AimModal;
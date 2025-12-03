import "./style.css";
import { Container, Col, Row, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, storage } from '../../../../config';

function SettingsPanel({ selectedCategory }) {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [isNameInvalid, setNameInvalid] = useState(false);

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        setName(selectedCategory.name);
    }, [selectedCategory]);

    const onSaveName = async () => {
        let isInvalid = name.length === 0;

        setNameInvalid(isInvalid);

        if (isInvalid)
            return;

        const url = API_BASE_URL + "category";

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                },
                body: JSON.stringify({
                    name: name,
                    id: selectedCategory._id
                }),
            });

            const responseData = await response.json();

            if (!!responseData.keyword) {
                console.error(responseData);
                alert("Произошла ошибка!");
            }
            else {
                alert("Сохранено!");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onDelete = async () => {
        const url = API_BASE_URL + "category/" + selectedCategory._id;
        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                navigate("/categories");
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла непредвиденная ошибка");
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
        <Container style={{ overflowY: "auto" }}>
            <Row className="mt-2 mb-2" >
                <Col className="col-3 ms-2">
                    <Form.Control isInvalid={isNameInvalid} type="text" placeholder='Название' value={name} onChange={(e) => setName(e.target.value)} />
                </Col>
                <Col className="col-auto">
                    <Button className="btn-primary" onClick={() => { onSaveName() }}>
                        Сохранить
                    </Button>
                </Col>
            </Row >
            <Row className="mb-1" >
                {showAlert ? (
                    <>
                        <Col className="col-3 ms-2">
                            <p className="fs-4">Вы уверены?</p>
                        </Col>
                        <Col className="col-auto">
                            <Button className="btn-success" onClick={() => { onDelete() }}>
                                Удалить
                            </Button>
                        </Col>
                        <Col className="col-auto">
                            <Button className="btn-danger" onClick={() => { setShowAlert(false) }}>
                                Отмена
                            </Button>
                        </Col>
                    </>
                ) : (
                    <Col className="col-auto ms-2">
                        <Button variant="danger" onClick={() => { setShowAlert(true) }}>
                            Удалить проект
                        </Button>
                    </Col>
                )
                }
            </Row >
        </Container>
    );
}

export default SettingsPanel;
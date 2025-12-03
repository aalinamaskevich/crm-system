import "./style.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container, Button, Form } from 'react-bootstrap';
import { API_BASE_URL, storage } from '../../config';

function CategoriesPage() {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [showAddPanel, setShowAddPanel] = useState(false);

    const [name, setName] = useState('');
    const [isNameInvalid, setNameInvalid] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const onAdd = async () => {
        let isInvalid = name.length === 0;

        setNameInvalid(isInvalid);

        if (isInvalid)
            return;

        const url = API_BASE_URL + "category";

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                },
                body: JSON.stringify({
                    name: name,
                    accountId: storage.getItem('id')
                }),
            });

            const responseData = await response.json();

            if (!!responseData.keyword) {
                console.error(responseData);
                alert("Произошла ошибка!");
            }
            else {
                setName('');
                setShowAddPanel(false);
                fetchCategories();
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCategories = async () => {
        const url = API_BASE_URL + "category/account/" + storage.getItem('id');
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                }
            });
            const responseData = await response.json();
            setCategories(responseData);
            return responseData;
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="background-div">
            <Container className="mt-5" style={{ overflowY: "auto" }}>
                <Row className="justify-content-center">
                    <Col className="col-auto text-center">
                        <p className="fs-3 fw-bold" style={{color: "#244289"}}>
                            Выберите проект
                        </p>
                    </Col>
                </Row>
                {!!categories && categories.length !== 0 && (
                    <Row className="mt-3 justify-content-center">
                        {categories.map(
                            (category, index) => {
                                return (
                                    <Col className="col-4 mt-2">
                                        <div className="bg-white">
                                            <div className="hover-secondary text-center border border-primary rounded-3 border-3" style={{ minHeight: "50px" }} onClick={() => { navigate("/calendar/" + category._id) }}>
                                                <p className="fs-3 fw-bold ms-2" style={{ marginBottom: "0px", overflow: "hidden", color: "#244289" }}>{category.name}</p>
                                            </div>
                                        </div>
                                    </Col>
                                )
                            }
                        )}
                    </Row>
                )}
                <Row className="mt-3 justify-content-center">
                    {showAddPanel ? (
                        <>
                            <Col className="col-6 ms-2">
                                <Form.Control isInvalid={isNameInvalid} type="text" placeholder='Название' value={name} onChange={(e) => setName(e.target.value)} />
                            </Col>
                            <Col className="col-auto">
                                <Button variant="primary" className="rounded-3" onClick={() => { onAdd() }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                        <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                    </svg>
                                </Button>
                            </Col>
                            <Col className="col-auto">
                                <Button variant="primary" className="rounded-3" onClick={() => { setShowAddPanel(false) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                    </svg>
                                </Button>
                            </Col>
                        </>
                    ) : (
                        <Col className="col-auto ms-2">
                            <Button variant="primary" className="rounded-3" onClick={() => { setShowAddPanel(true) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                </svg>
                            </Button>
                        </Col>
                    )
                    }
                </Row>
            </Container>
        </div>
    );
}

export default CategoriesPage;
import "./style.css";
import { Container, Table, Col, Row, FloatingLabel, Form, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, storage } from '../../../../config';

function CategoryPanel({ categories, selectedCategory, setSelectedCategory, onInvalidateCategories }) {

    const [showAddPanel, setShowAddPanel] = useState(false);

    const [name, setName] = useState('');
    const [isNameInvalid, setNameInvalid] = useState(false);

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
                onInvalidateCategories(true);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <Row className="mt-2 mb-1" >
                {showAddPanel ? (
                    <>
                        <Col className="col-6 ms-2">
                            <Form.Control isInvalid={isNameInvalid} type="text" placeholder='Название' value={name} onChange={(e) => setName(e.target.value)} />
                        </Col>
                        <Col className="col-auto">
                            <Button className="btn-success" onClick={() => { onAdd() }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-check-lg" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z" />
                                </svg>
                            </Button>
                        </Col>
                        <Col className="col-auto">
                            <Button className="btn-danger" onClick={() => { setShowAddPanel(false) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                            </Button>
                        </Col>
                    </>
                ) : (
                    <Col className="col-auto ms-2">
                        <Button onClick={() => { setShowAddPanel(true) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                            </svg>
                        </Button>
                    </Col>
                )
                }
            </Row >
            <div style={{ overflowY: "auto" }}>
                {
                    categories.map(
                        (category, index) => {
                            return (
                                <Row style={{width: "300px", paddingRight: "0px" }} className={!!selectedCategory && selectedCategory._id === category._id ? "bg-primary text-white" : "hover-secondary"} onClick={() => {setSelectedCategory(category)}}>
                                    <Col>
                                        <p className="fs-4 ms-2" style={{marginBottom: "0px", overflow: "hidden"}}>{category.name}</p>
                                    </Col>
                                </Row >
                            )
                        }
                    )
                }
            </div>
        </div >
    );
}

export default CategoryPanel;
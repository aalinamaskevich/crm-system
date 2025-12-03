import "./style.css";
import { Container, Table, Col, Row, FloatingLabel, Form, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { API_BASE_URL, storage } from '../../../../config';
import AimModal from "../AimModal/AimModal";

function AimsPanel({ selectedCategory, fetchCategory }) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");

    const [filtered, setFiltered] = useState([]);

    const [isNew, setNew] = useState(false);

    useEffect(() => {
        let aims = selectedCategory.aims;

        if (sort === "name")
            aims.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        else if (sort === "duration")
            aims.sort((a, b) => String(a.duration).toLowerCase().localeCompare(String(b.duration).toLowerCase()));
        else if (sort === "count")
            aims.sort((a, b) => String(a.count).toLowerCase().localeCompare(String(b.count).toLowerCase()));

        if (!search || search.length === 0) {
            setFiltered(aims);
            return;
        }

        setFiltered(aims.filter(aim =>
            (aim.name && aim.name.toLowerCase().includes(search.toLowerCase())) ||
            (String(aim.duration).toLowerCase().includes(search.toLowerCase())) ||
            ((aim.count === 0 ? "Бесконечно" : String(aim.count)).toLowerCase().includes(search.toLowerCase()))
        ));
    }, [search, sort, selectedCategory]);

    const onAdd = () => {
        setNew(true);
    }

    const onDelete = async (id) => {
        const url = API_BASE_URL + "aims/" + id;
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
                fetchCategory();
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

    const onCloseModal = (isSuccess) => {
        setNew(false);

        if (isSuccess)
            fetchCategory();
    };

    return (
        <Container style={{ overflowY: "auto" }}>
            <Row className="justify-content-between mt-3">
                <Col className="col-auto">
                    <Row>
                        <Col className="col-auto">
                            <p className='fs-3'>Автопланирование:</p>
                        </Col>
                        <Col className="col-auto align-self-center">
                            <Button className='btn-primary' onClick={onAdd}>Добавить</Button>
                        </Col>
                    </Row>
                </Col>
                <Col className="col-4">
                    <Row className="justify-content-end">
                        <Col className="col-6">
                            <FloatingLabel controlId="floatingDepartment" label="Сортировка">
                                <Form.Select onChange={(e) => setSort(e.target.value)}>
                                    <option selected={sort === ''} value=''>Без сортировки</option>
                                    <option selected={sort === 'name'} value='name'>По названию</option>
                                    <option selected={sort === 'duration'} value='duration'>По частоте</option>
                                    <option selected={sort === 'count'} value='count'>По количеству</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Col>
                        <Col className="col-6">
                            <FloatingLabel controlId="floatingSearch" label="Поиск">
                                <Form.Control type="text" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                            </FloatingLabel>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {!!filtered && filtered.length !== 0 ? (
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                                <th className="col-1">#</th>
                                <th className="col-5">Название</th>
                                <th className="col-2">Периодичность</th>
                                <th className="col-2">Количество</th>
                                <th className="col-2">Дата начала</th>
                                <th className="col-auto"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((aim, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{aim.name}</td>
                                        <td>Раз в {aim.duration} д.</td>
                                        <td>{aim.count === 0 ? "Бесконечно" : aim.count + " раз(а)"}</td>
                                        <td>{format(new Date(aim.date), 'dd.MM.yyyy')}</td>
                                        <td>
                                            <Button variant="secondary" onClick={() => { onDelete(aim._id) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                </svg>
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>) :
                    (
                        <Col className="col-auto">
                            <p className='fs-3 mt-3'>Ничего не найдено</p>
                        </Col>
                    )}
            </Row>

            {isNew && (<AimModal categoryId={selectedCategory._id} onCloseModal={onCloseModal} />)}
        </Container>
    );
}

export default AimsPanel;
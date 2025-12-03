import "./style.css";
import { Container, Table, Col, Row, FloatingLabel, Form, Button } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { API_BASE_URL, storage } from '../../config';

function UsersPage() {
    const [search, setSearch] = useState("");
    const [clients, setClients] = useState(null);

    const getCredentials = (firstname, surname, lastname) => {
        if(!firstname && !surname && !lastname)
            return "Не указан";

        return (!surname? "" : surname + " ") + (!firstname? "" : firstname[0] + ".") + (!lastname? "" : lastname[0] + ".");
    }

    const filterBySearch = (client, index) => {
        const credentials = getCredentials(client.firstname, client.surname, client.lastname);
        const telephone = !!client.telephone ? client.telephone: "Не указан";

        const value = (
            <tr key={client.id}>
                <td>{index + 1}</td>
                <td>{client.account.username}</td>
                <td>{credentials}</td>
                <td>{telephone}</td>
                <td><Button className={client.account.isActive? 'btn-success' : 'btn-danger'} onClick={() => {onBan(client.accountId)}}>{client.account.isActive? "Заблокировать" : "Разблокировать"}</Button></td>
            </tr>
        );
        if (search.length === 0 ||
            (index+1).toString().includes(search) ||
            client.account.username.includes(search) ||
            credentials.includes(search) ||
            telephone.includes(search))
            return value;

        return (<></>);
    }

    const fetchClients = async () => {
        const url = API_BASE_URL + "profile-info";
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });
            const responseData = await response.json();
            setClients(responseData);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchClients();
    }, []);

    const onBan = async (id) => {
        const url = API_BASE_URL + "account/" + id;
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                }
            });

            const responseData = await response.json();

            if(!responseData.keyword){
                await fetchClients();
            }
            else if(responseData.keyword === "ID"){
                alert("Произошла непредвиденная ошибка");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            <Row className="justify-content-between mt-3">
                <Col className="col-auto">
                    <Row>
                        <Col className="col-auto">
                            <p className='fs-3'>Клиенты:</p>
                        </Col>
                    </Row>
                </Col>
                <Col className="col-2">
                    <FloatingLabel controlId="floatingSearch" label="Поиск">
                        <Form.Control type="text" placeholder="search" value={search} onChange={(e) => setSearch(e.target.value)} />
                    </FloatingLabel>
                </Col>
            </Row>
            {!!clients && clients.length !== 0 ? (
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>username</th>
                            <th>ФИО</th>
                            <th>Телефон</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => filterBySearch(client, index))}
                    </tbody>
                </Table>) :
                (
                    <Row className="justify-content-center">
                        <Col className="col-auto">
                            <p className='fs-3 mt-3'>Список клиентов пуст</p>
                        </Col>
                    </Row>
                )}    
        </Container>
    );
}

export default UsersPage;
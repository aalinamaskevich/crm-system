import "./style.css";
import React, { useState, useEffect } from "react";
import { Navbar, Nav, Col, Row } from 'react-bootstrap';
import { storage, COMPANY_NAME } from "../../config";
import { useNavigate } from "react-router-dom";

function NavigationBar() {
    const [role, setRole] = useState(storage.getItem('role'));

    const navigate = useNavigate();

    const onExit = () => {
        storage.removeItem('token');
        storage.removeItem('id');
        storage.removeItem('username');
        storage.removeItem('role');
        setRole(null);
        navigate("/");
    };

    useEffect(() => {
        const handleStorageChange = () => {
            const userRole = storage.getItem('role');
            setRole(userRole);
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        // if (storage.getItem('role') === 'ADMIN') {
        //     navigate('/users')
        // }
        // else if (storage.getItem('role') === 'USER') {
        //     navigate('/categories')
        // }
        // else {
        //     navigate('/')
        // }
    }, [role]);

    const renderRoleRoutes = () => {
        if (role === "USER")
            return (
                <>
                    <Nav.Link style={{color: "#244289"}} href="/account">Профиль</Nav.Link>
                </>
            )
        return (<></>);
    }

    return (
        <Row style={{margin: "0px", padding: "0px", width: "100vw"}}>
            <Navbar style={{height : "56px", width: "100vw" }} className="bg-primary">
                <Navbar.Brand className="ms-3" href="/" style={{color: "#244289"}}>{COMPANY_NAME}</Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="nav-link">
                        {renderRoleRoutes()}
                    </Nav>
                </Navbar.Collapse>
                <Row className="justify-content-end">
                    <Col>
                        {!!role && (<Nav.Link className="me-4" style={{color: "#244289"}} onClick={onExit}>Выйти</Nav.Link>)}
                    </Col>
                </Row>
            </Navbar>
        </Row>
    );
}

export default NavigationBar;
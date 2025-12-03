import "./style.css";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Row, Col, Tab, Tabs } from 'react-bootstrap';
import { API_BASE_URL, storage } from '../../config';
import CalendarPanel from "./components/CalendarPanel/CalendarPanel";
import AimsPanel from "./components/AimsPanel/AimsPanel";

import SettingsPanel from "./components/SettingsPanel/SettingsPanel";
import StatisticsPanel from "./components/StatisticsPanel/StatisticsPanel";

function CalendarPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (!!id) {
            fetchCategory();
        }
        else {
            navigate("/categories");
        }
    }, [id]);

    const [category, setCategory] = useState(null);

    const [tab, setTab] = useState('calendar');

    const fetchCategory = async () => {
        const url = API_BASE_URL + "category/" + id;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                }
            });
            const responseData = await response.json();
            setCategory(responseData);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Row style={{ height: "100vh" }}>
            <Col style={{ width: "100%" }}>
                {!!category ? (
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={tab}
                        onSelect={(k) => setTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="calendar" style={{ color: "#244289" }} title="Календарь">
                            <CalendarPanel selectedCategory={category} fetchCategory={fetchCategory} />
                        </Tab>
                        <Tab eventKey="aims" style={{ color: "#244289" }} title="Автопланирование">
                            <AimsPanel selectedCategory={category} fetchCategory={fetchCategory} />
                        </Tab>
                        <Tab eventKey="statistics" style={{ color: "#244289" }} title="Статистика">
                            <StatisticsPanel selectedCategory={category} fetchCategory={fetchCategory} />
                        </Tab>
                        <Tab eventKey="settings" style={{ color: "#244289" }} title="Настройки">
                            <SettingsPanel selectedCategory={category} />
                        </Tab>
                    </Tabs>
                ) : (
                    <Row className="justufy-content-center">
                        <Col className="text-center">
                            <p className="fs-3 fw-bold">Выберите проект</p>
                        </Col>
                    </Row>
                )
                }
            </Col >
        </Row >
    );
}

export default CalendarPage;
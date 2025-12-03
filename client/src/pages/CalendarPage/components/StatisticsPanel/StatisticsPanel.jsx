import "./style.css";
import { Col, Row, Button, Card } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, startOfMonth, endOfMonth, addDays, isAfter, isSameDay, endOfWeek, addMonths } from 'date-fns';
import CircleChart from "../../../../components/CircleChart/CircleChart.jsx";

function StatisticsPanel({ selectedCategory, fetchCategory }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [days, setDays] = useState([]);

    const [daysData, setDaysData] = useState([]);
    const [aimsData, setAimsData] = useState([]);

    const getEventsForDay = (day) => {
        if (!selectedCategory || !selectedCategory.aims) return [];
        return selectedCategory.aims.filter(aim => {
            let eventDay = new Date(aim.date);
            if (isSameDay(eventDay, day)) return true;

            if (aim.duration > 0 && aim.count !== 1) {
                for (let i = 0; aim.count === 0 || i < aim.count; i++) {
                    eventDay = addDays(eventDay, aim.duration);
                    if (isSameDay(eventDay, day)) return true;
                    if (isAfter(eventDay, endOfMonth(currentMonth))) break;
                }
            }
            return false;
        });
    };

    const getItemsForDay = (day) => {
        if (!selectedCategory || !selectedCategory.items) return [];
        return selectedCategory.items.filter(item => {
            let itemDay = new Date(item.date);
            if (isSameDay(itemDay, day)) return true;

            return false;
        });
    };

    function areAllRequiredPostsMadeInMonth(aim, start, end) {
        const requiredDates = [];

        let currentDate = new Date(aim.date);
        let i = 0;

        while ((aim.count === -1 || i < aim.count) && currentDate <= end) {
            if (currentDate >= start && currentDate <= end) {
                requiredDates.push(new Date(currentDate));
            }

            // Следующая дата по периодичности
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + aim.duration);
            i++;
        }

        const postDates = new Set(
            (aim.items || []).map(item => new Date(item.date))
        );

        // Проверка, что все обязательные даты присутствуют среди записей
        return requiredDates.every(date => postDates.has(date));
    };

    useEffect(() => {
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)

        let dayList = [];
        let day = start;
        while (!isAfter(day, end)) {
            dayList.push(day);
            day = addDays(day, 1);
        }
        setDays(dayList);
    }, [currentMonth, selectedCategory]);

    useEffect(() => {
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)

        if (days.length === 0)
            return;

        let newDaysData = [
            {
                name: "Дни с записями",
                color: "#198754",
                angle: 0
            },
            {
                name: "Дни без записей",
                color: "#dc3545",
                angle: 0
            }
        ];

        for (let i of days) {
            const events = getEventsForDay(i);
            const unexpectedItems = getItemsForDay(i);

            let isFound = unexpectedItems.length !== 0;
            if (!isFound) {
                for (let j of events) {
                    const eventItem = j.items?.find(item => isSameDay(new Date(item.date), i));
                    isFound |= !!eventItem;

                    if (isFound)
                        break;
                }
            }

            newDaysData[isFound ? 0 : 1].angle++;

        }

        let newAimsData = [
            {
                name: "Завершенные",
                color: "#198754",
                angle: 0
            },
            {
                name: "Незавершенные",
                color: "#dc3545",
                angle: 0
            }
        ];

        for (let i of selectedCategory.aims) {
            newAimsData[areAllRequiredPostsMadeInMonth(i, start, end) ? 0 : 1].angle++;
        }

        for(let i in newDaysData){
            newDaysData[i].name += " (" + newDaysData[i].angle + ")";
        }

        for(let i in newAimsData){
            newAimsData[i].name += " (" + newAimsData[i].angle + ")";
        }

        setDaysData(newDaysData);
        setAimsData(newAimsData);

    }, [days]);

    return (
        <div className="container">
            <Row className="justify-content-center">
                <Col className="col-auto">
                    <Button onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
                        -
                    </Button>
                </Col>
                <Col className="col-auto">
                    <h3 className="text-center" style={{ color: "#244289" }}>{format(currentMonth, "MMMM yyyy")}</h3>
                </Col>
                <Col className="col-auto">
                    <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                        +
                    </Button>
                </Col>
            </Row>
            {!!daysData && !!aimsData && (
                daysData.length === 0 || aimsData.length === 0 ? (
                    <Row className="justify-content-center">
                        <Col className="text-center">
                            <p className="fs-5 fw-bold">Пока недостаточно данных</p>
                        </Col>
                    </Row>
                ) : (
                    <>
                        <Row className="mb-2">
                            <Col className="col-6">
                                <Row>
                                    <CircleChart
                                        width={350}
                                        height={350}
                                        data={daysData}
                                        label={""}
                                    />
                                </Row>
                                <Row className="justify-content-center">
                                    <Col className="text-center">
                                        <p className="fs-5 fw-bold">Частота записей по дням месяца</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className="col-6">
                                <Row>
                                    <CircleChart
                                        width={350}
                                        height={350}
                                        data={aimsData}
                                        label={""}
                                    />
                                </Row>
                                <Row className="justify-content-center">
                                    <Col className="text-center">
                                        <p className="fs-5 fw-bold">Выполнение автопланирования за месяц</p>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </>
                )
            )}
        </div>
    );
}

export default StatisticsPanel;
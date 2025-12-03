import "./style.css";
import { Col, Row, Button, Card } from "react-bootstrap";
import React, { useState, useEffect } from 'react';
import { format, startOfWeek, startOfMonth, endOfMonth, addDays, isAfter, isSameDay, endOfWeek, addMonths } from 'date-fns';
import ItemModal from "../ItemModal/ItemModal";

function CalendarPanel({ selectedCategory, fetchCategory }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [days, setDays] = useState([]);

    const [isNew, setNew] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedAimId, setSelectedAimId] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));

        let dayList = [];
        let day = start;
        while (!isAfter(day, end)) {
            dayList.push(day);
            day = addDays(day, 1);
        }
        setDays(dayList);
    }, [currentMonth, selectedCategory]);

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

    const onItemModal = (eventItem, day, aimId) => {
        if (!!eventItem)
            setSelectedItem(eventItem);
        else
            setNew(true);

        setSelectedDate(day);
        setSelectedAimId(aimId);
    };

    const onCloseModal = () => {
        setSelectedItem(null);
        setNew(false);
        setSelectedDate(null);
        setSelectedAimId(null);

        fetchCategory();
    };

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
            <Row style={{ maxHeight: "70vh", overflowY: "scroll" }}>
                {days.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const events = getEventsForDay(day);
                    const unexpectedItems = getItemsForDay(day);

                    return (
                        <div key={index} style={{ width: "14%" }} className="p-1">
                            <Card
                                className={`text-center ${isCurrentMonth ? "bg-light" : "bg-secondary text-muted"}`}
                                style={{ height: "120px", padding: "5px" }}
                            >
                                <div style={{ fontSize: "24px" }}>{format(day, "d")}</div>
                                <div style={{ fontSize: "12px" }}>{format(day, "EEE")}</div>
                                <div style={{ overflowY: "auto", overflowX: "hidden" }}>
                                    <Row>
                                        <div
                                            className={`clickable-event hover-secondary`}
                                            onClick={() => onItemModal(null, day, null)}
                                        >
                                            +
                                        </div>
                                    </Row>
                                    {events.map((event, i) => {
                                        const eventItem = event.items?.find(item => isSameDay(new Date(item.date), day));

                                        return (
                                            <Row key={i}>
                                                <div
                                                    className={`clickable-event hover-secondary  ${eventItem ? "bg-success" : ""}`}
                                                    onClick={() => onItemModal(eventItem, day, event._id)}
                                                >
                                                    {event.name}
                                                </div>
                                            </Row>
                                        );
                                    })}
                                    {unexpectedItems.map((item, i) => {
                                        return (
                                            <Row key={i}>
                                                <div
                                                    className={`clickable-event hover-secondary bg-success`}
                                                    onClick={() => onItemModal(item, day, null)}
                                                >
                                                    {"Без плана " + (i+1) } 
                                                </div>
                                            </Row>
                                        );
                                    })}
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </Row>
            {(isNew || !!selectedItem) && (<ItemModal aimId={selectedAimId} onCloseModal={onCloseModal} isNew={isNew} item={selectedItem} date={selectedDate} categoryId={selectedCategory._id} />)}
        </div>
    );
}

export default CalendarPanel;
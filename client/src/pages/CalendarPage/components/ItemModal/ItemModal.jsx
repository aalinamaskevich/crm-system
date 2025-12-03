import "./style.css";
import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Modal, Image } from 'react-bootstrap';
import { API_BASE_URL, storage } from '../../../../config';

function ItemModal({ item, onCloseModal, isNew, aimId, date, categoryId }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");

    const [file, setFile] = useState(null);

    const [isNameInvalid, setNameInvalid] = useState(false);
    const [isDescriptionInvalid, setDescriptionInvalid] = useState(false);
    const [isImageInvalid, setImageInvalid] = useState(false);

    useEffect(() => {
        if (!!item) {
            setName(item.name);
            setDescription(item.description);
            setImage(API_BASE_URL + "img/" + item.imagePath);
        }
    }, [item]);

    const onChangeImage = (e) => {
        const targetFile = e.target.files[0];
        setFile(targetFile);
        if (targetFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(targetFile);
        }
    };

    const onUploadImage = async () => {
        const formData = new FormData();

        formData.append('image', file);

        try {
            const response = await fetch(API_BASE_URL + "img", {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`
                },
                body: formData,
            });

            const responseData = await response.json();

            console.log(responseData);
            if (!responseData.keyword) {
                return responseData.message;
            }
            else if (responseData.keyword === "FILE") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
                return null;
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }

    const onCreate = async () => {
        const url = API_BASE_URL + "item";
        let img = image;
        if (!!file) {
            img = await onUploadImage();
            if (!img)
                return;
        }
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    description: description,
                    imagePath: img,
                    aimId: aimId,
                    date: date,
                    categoryId: categoryId
                }),
            });

            const responseData = await response.json();

            if (!responseData.keyword) {
                onCloseModal();
            }
            else if (responseData.keyword === "CATEGORY_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const onUpdate = async () => {
        const url = API_BASE_URL + "item";
        let img = image;
        if (!!file) {
            img = await onUploadImage();
            if (!img)
                return;
        }

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    'Authorization': `Bearer ${storage.getItem('token')}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: item._id,
                    name: name,
                    description: description,
                    imagePath: img
                }),
            });
            const responseData = await response.json();

            if (!responseData.keyword) {
                onCloseModal();
            }
            else if (responseData.keyword === "CATEGORY_ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    const isImage = (file) => {
        return file.toString().startsWith('data:image/');
    };

    const onSave = async () => {
        let isInvalid = name.length === 0 || description.length === 0;

        setNameInvalid(name.length === 0);
        setDescriptionInvalid(description.length === 0);

        if (isInvalid)
            return;

        isInvalid = !!file && file.length !== 0 && !isImage(image);
        setImageInvalid(isInvalid);

        if (isInvalid)
            return;

        await (isNew ? onCreate() : onUpdate());
    }

    const onDelete = async () => {
        const url = API_BASE_URL + "item/" + item._id;

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
                onCloseModal();
            }
            else if (responseData.keyword === "ID") {
                alert("Произошла ошибка!");
                console.error(responseData.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Modal show="true" onHide={onCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>{isNew ? "Добавление" : "Изменение"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="justify-content-center">
                    <Col className="col-auto">
                        <Image src={image} style={{ width: '460px', height: '200px' }} alt="Изображение" />
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Form.Control isInvalid={isImageInvalid} type="file" placeholder="Изображение" onChange={onChangeImage} />
                </Row>
                <Row className="mt-3">
                    <Form.Control isInvalid={isNameInvalid} value={name} type="text" placeholder="Заголовок" onChange={(e) => setName(e.target.value)} />
                </Row>
                <Row className="mt-3">
                    <Form.Control isInvalid={isDescriptionInvalid} as="textarea" rows={11} placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} />
                </Row>
                <Row className='mt-4 justify-content-start'>
                    <Button className='col-auto btn-primary ms-3' onClick={onSave}>Сохранить</Button>
                    {!isNew && (<Button className='col-auto btn-danger ms-3' onClick={onDelete}>Удалить</Button>)}
                </Row>
            </Modal.Body>
        </Modal>
    )
}

export default ItemModal;
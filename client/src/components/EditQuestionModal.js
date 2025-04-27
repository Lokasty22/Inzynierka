import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import SubjectList from './SubjectList';

const EditQuestionModal = ({ show, onHide, question }) => {
    const [formData, setFormData] = useState({
        title: question.title,
        subject: question.subject,
        description: question.description,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const setSubjectValue = (value) => {
        handleChange({
            target:{
                name: "subject",
                value: value,
            },
        });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/api/questions/${question._id}`,
                formData,
                {
                    headers: { 'x-auth-token': token },
                }
            );
            onHide();
        } catch (err) {
            setError('Błąd podczas aktualizacji pytania.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edytuj Pytanie</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSaveChanges}>
                    <Form.Group controlId="title" className="mb-3">
                        <Form.Label>Tytuł</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            minLength={10}
                            maxLength={50}
                        />
                    </Form.Group>
                    <Form.Group controlId="subject" className="mb-3">
                        <Form.Label>Przedmiot</Form.Label>
                        <SubjectList subject={formData.subject} setSubject={setSubjectValue} />
                    </Form.Group>
                    <Form.Group controlId="description" className="mb-3">
                        <Form.Label>Opis</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            minLength={15}
                            maxLength={500}
                        />
                    </Form.Group>
                    <div className="text-end">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Anuluj
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Zapisz zmiany'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default EditQuestionModal;

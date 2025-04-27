import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const EditMyListings = ({ show, onHide, listing }) => {
    const [formData, setFormData] = useState({
        title: listing.title,
        subject: listing.subject,
        pricePerHour: listing.pricePerHour,
        location: listing.location,
        description: listing.description,
        teachingScope: listing.teachingScope || '',
        experience: listing.experience || '',
        education: listing.education || '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const subjects = ['Matematyka', 'Fizyka', 'Chemia', 'Biologia', 'Geografia', 'Historia', 'Wiedza o społeczeństwie', 'Angielski', 'Polski',
        'Niemiecki', 'Hiszpański', 'Francuski', 'Włoski', 'Łacina', 'Filozofia', 'Muzyka', 'Gra na instrumencie', 'Zajęcia sportowe'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/api/listings/${listing._id}`,
                formData,
                {
                    headers: { 'x-auth-token': token },
                }
            );
            onHide();
        } catch (err) {
            setError('Błąd podczas aktualizacji ogłoszenia.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edytuj Ogłoszenie</Modal.Title>
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
                        />
                    </Form.Group>
                    <Form.Group controlId="subject" className="mb-3">
                        <Form.Label>Przedmiot</Form.Label>
                        <Form.Select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Wybierz przedmiot</option>
                            {subjects.map((subject) => (
                                <option key={subject} value={subject}>
                                    {subject}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="pricePerHour" className="mb-3">
                        <Form.Label>Cena za godzinę (zł)</Form.Label>
                        <Form.Control
                            type="number"
                            name="pricePerHour"
                            value={formData.pricePerHour}
                            onChange={handleChange}
                            required
                        />
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
                        />
                    </Form.Group>
                    {/* no-we pola*/}
                    <Form.Group controlId="teachingScope" className="mb-3">
                        <Form.Label>Zakres nauczania</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="teachingScope"
                            value={formData.teachingScope}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="experience" className="mb-3">
                        <Form.Label>Doświadczenie</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="education" className="mb-3">
                        <Form.Label>Wykształcenie</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
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

export default EditMyListings;

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import moment from 'moment';
import ProfilePicture from './ProfilePicture';
import { Card, Button, Spinner, Modal, Row, Col, Form, Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPencilAlt, FaStar } from 'react-icons/fa';

const ReviewItem = ({ listingId, review, onUpdate }) => {
    const { user } = useContext(AuthContext);
    const isOwner = user && review.student && user._id === review.student._id;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editComment, setEditComment] = useState(review.comment || '');
    const [editRating, setEditRating] = useState(review.rating || 0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Brak tokenu uwierzytelniającego. Zaloguj się ponownie.');
                setLoading(false);
                return;
            }

            await axios.delete(`/api/listings/${listingId}/reviews/${review._id}`, {
                headers: { 'x-auth-token': token },
            });
            onUpdate();
            setShowDeleteModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Błąd podczas usuwania recenzji.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const commentRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .,!?;:'"()\[\]\s-]{10,500}$/;
        if (!commentRegex.test(editComment)) {
            setError('Komentarz zawiera niedozwolone znaki lub jest za krótki. Minimum 10 znaków.');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Brak tokenu uwierzytelniającego. Zaloguj się ponownie.');
                setLoading(false);
                return;
            }

            const data = {
                comment: editComment,
                rating: editRating,
            };
            await axios.put(`/api/listings/${listingId}/reviews/${review._id}`, data, {
                headers: { 'x-auth-token': token },
            });
            onUpdate();
            setShowEditModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Błąd podczas edycji recenzji.');
        } finally {
            setLoading(false);
        }
    };

    const stars = Array.from({ length: 5 }, (_, index) => (
        <FaStar
            key={index}
            className={`me-1 ${index < (review.rating || 0) ? 'text-warning' : 'text-muted'}`}
        />
    ));

    return (
        <>
            <Card className="mb-3 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col xs="auto">
                            {review.student ? (
                                <ProfilePicture user={review.student} size={50} />
                            ) : (
                                <ProfilePicture user={null} size={50} defaultAvatar />
                            )}
                        </Col>
                        <Col>
                            <h6 className="mb-0">
                                {review.student
                                    ? `${review.student.firstName} ${review.student.lastName}`
                                    : 'Usunięty użytkownik'}
                            </h6>
                            <div className="text-muted" style={{ fontSize: '0.9em' }}>
                                {moment(review.createdAt).format('DD.MM.YYYY, HH:mm')}
                                {review.updatedAt && (
                                    <span>
                                        {' '}
                                        <FaPencilAlt className="ms-2" /> Edytowano:{' '}
                                        {moment(review.updatedAt).format('DD.MM.YYYY, HH:mm')}
                                    </span>
                                )}
                            </div>
                        </Col>
                        <Col xs="auto" className="text-end">
                            <div>{stars}</div>
                        </Col>
                    </Row>
                    <Card.Text className="mt-3">{review.comment || 'Brak komentarza.'}</Card.Text>
                    {isOwner && (
                        <div className="text-end">
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => setShowEditModal(true)}
                            >
                                <FaEdit className="me-1" />
                                Edytuj
                            </Button>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setShowDeleteModal(true)}
                                disabled={loading}
                            >
                                {loading ? (
                                    <Spinner as="span" animation="border" size="sm" />
                                ) : (
                                    <>
                                        <FaTrash className="me-1" />
                                        Usuń
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                </Card.Body>
            </Card>

            {/* Edytowanie */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edytuj recenzję</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEdit}>
                        <Form.Group controlId="editRating" className="mb-3">
                            <Form.Label>Ocena</Form.Label>
                            <Form.Select
                                value={editRating}
                                onChange={(e) => setEditRating(parseInt(e.target.value))}
                                required
                            >
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating} - {['Bardzo dobry', 'Dobry', 'Średni', 'Słaby', 'Bardzo słaby'][5 - rating]}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="editComment" className="mb-3">
                            <Form.Label>Komentarz</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editComment}
                                onChange={(e) => setEditComment(e.target.value)}
                                required
                            />
                        </Form.Group>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <div className="text-end">
                            <Button
                                variant="secondary"
                                onClick={() => setShowEditModal(false)}
                                className="me-2"
                            >
                                Anuluj
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Zapisz zmiany'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Usuwanie */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Potwierdź usunięcie</Modal.Title>
                </Modal.Header>
                <Modal.Body>Czy na pewno chcesz usunąć tę recenzję?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Anuluj
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Usuń'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

};

export default ReviewItem;

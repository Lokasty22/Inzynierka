import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Form, Button, Alert, Spinner, Card } from 'react-bootstrap';

const ReviewForm = ({ listingId, existingReview, onSuccess, teacherId }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [comment, setComment] = useState(existingReview ? existingReview.comment : '');
    const [rating, setRating] = useState(existingReview ? existingReview.rating : 5);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isAuthenticated) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const commentRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9 .,!?;:'"()\[\]\s-]{10,500}$/;

        if(!commentRegex.test(comment)) {
            setError('Komentarz zawiera niedozwolone znaki lub jest za krótki. Minimum 10 znaków.');
            setLoading(false);
            return;
        }


        if(teacherId === user._id) {
            setError('Nie możesz dodać recenzji do swojego ogłoszenia.');
            setLoading(false);
            return;
        }
        
        try {
            if (existingReview) {
                // Edycja recenzji
                await axios.put(`/api/listings/${listingId}/reviews/${existingReview._id}`, { comment, rating });
            } else {
                // Dodanie nowej recenzji
                await axios.post(`/api/listings/${listingId}/reviews`, { comment, rating });
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Błąd podczas zapisywania recenzji.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-3 shadow-sm">
            <Form onSubmit={handleSubmit}>
                <h5 className="mb-3">{existingReview ? 'Edytuj Recenzję' : 'Dodaj Recenzję'}</h5>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form.Group className="mb-3" controlId="rating">
                    <Form.Label>Ocena</Form.Label>
                    <Form.Select
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        required
                    >
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="comment">
                    <Form.Label>Komentarz</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Napisz swoją recenzję..."
                    />
                </Form.Group>
                <div className="d-flex align-items-center">
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                {' Zapisywanie...'}
                            </>
                        ) : (
                            'Zapisz' 
                        )}
                    </Button>
                    {existingReview && (
                        <Button
                            variant="secondary"
                            className="ms-2"
                            onClick={() => onSuccess(false)}
                            disabled={loading}
                        >
                            Anuluj
                        </Button>
                    )}
                </div>
            </Form>
        </Card>
    );
};

export default ReviewForm;

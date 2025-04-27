import React from 'react';
import { Card, Row, Col, Spinner, Container } from 'react-bootstrap';
import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import { FaStar } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
const CoachReview = () => {
    const {loading} = useContext(AuthContext);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [fetching, setFetching] = useState(true);
    const fetchReviewData = async () => {
        setFetching(true);
        setError(null);
        try {
            const res = await axios.get('/api/reviews');
            setReviews(res.data);
        } catch (err) {
            setError('Błąd podczas pobierania recenzji.');
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchReviewData();
    }, []);
    
    if (loading || fetching) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" />
                <p className="mt-3">Ładowanie ogłoszeń...</p>
            </Container>
        );
        }

    if (error) {
        return <div className="container my-5 text-danger">{error}</div>;
    }

    if (!reviews || reviews.length === 0) {
        return <div className="container my-5">Brak recenzji.</div>;
    }

    const limitedReviews = reviews.slice(0, 4);

    const reviewArray = (array, size) => {
        let result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const reviewChunk = reviewArray(limitedReviews, 2);

    return (
        <div className="container my-5">
            <h2>Ostatnie opinie o korepetytorach</h2>
            {reviewChunk.map((chunk, index) => (
                <Row key={index}>
                    {chunk.map((item) => (

                        <Col key={item?.reviewId} md={6}>
                            
                            <Card className="mb-4 shadow-lg">
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs="auto">
                                            <ProfilePicture user={item?.student} size={50} />
                                        </Col>
                                        <Col>
                                            <Card.Title className="mb-0">
                                                {item?.student?.firstName ?? "undefined"} {item?.student?.lastName ?? "undefined"}
                                            </Card.Title>
                                            <Card.Subtitle className="text-muted">
                                                Korepetytor: {item?.teacher?.firstName ?? "undefined"} {item?.teacher?.lastName ?? "undefined"}
                                            </Card.Subtitle>
                                        </Col>
                                    </Row>
                                    <Card.Text className="mt-3">{item?.comment ?? "undefined"}</Card.Text>
                                    <div className="d-flex align-items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                className={i < item.rating ? 'text-warning' : 'text-muted'}
                                            />
                                        ))}
                                        <span className="ms-2">{item.rating} / 5</span>
                                    </div>
                                    <Link to={`/ogloszenia/${item.listingId}`} className="stretched-link" />
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ))}
        </div>
    );
};

export default CoachReview;

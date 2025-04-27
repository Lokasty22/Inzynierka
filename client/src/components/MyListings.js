import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaMapMarkerAlt, FaEdit, FaTrash, FaBook, FaMoneyBillWave } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyListing = ({ listing, onEdit, onDelete }) => {
    const {
        _id,
        title,
        subject,
        pricePerHour,
        city,
        state,
        description,
        promotionEndDate, 
    } = listing;

  
    const isPromoted = promotionEndDate && new Date(promotionEndDate) > new Date();

    return (
        <Card className="shadow-lg">
            <Card.Body>
                <Card.Title className="me-2">{title}</Card.Title>
                <Card.Subtitle className="mb-1 mt-2 text-muted">
                    <FaBook className="me-1" /> {subject}
                </Card.Subtitle>
                <Card.Text className="mb-1">
                    <FaMoneyBillWave className="me-2" />
                    {pricePerHour} zł/h
                </Card.Text>
                <Card.Text className="mb-1">
                    <FaMapMarkerAlt className="me-2" />
                    {city + ', ' + state}
                </Card.Text>
                <Card.Text className="mt-2">{description.substring(0, 100)}...</Card.Text>

                {/* Jeśli ogłoszenie jest promowane, wyświetlamy datę zakończenia promocji */}
                {isPromoted && (
                    <Card.Text className="mt-2 text-success">
                        Promowane do: {new Date(promotionEndDate).toLocaleDateString()}
                    </Card.Text>
                )}
                <Row className="mt-3">
                    <Col>
                        <Button variant="outline-primary" onClick={onEdit} className="me-2">
                            <FaEdit className="me-1" />
                            Edytuj
                        </Button>
                        <Button variant="outline-danger" onClick={onDelete}>
                            <FaTrash className="me-1" />
                            Usuń
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
                
            <Card.Footer className="text-end">
                <Link to={`/ogloszenia/${_id}`}>
                    <Button variant="primary">Zobacz szczegóły</Button>
                </Link>

                {/* Pokazujemy przycisk Promuj tylko jeśli ogłoszenie nie jest promowane */}
                {!isPromoted && (
                    <Link to={`/promuj/${_id}`}>
                        <Button variant="primary" className="ms-2">Promuj</Button>
                    </Link>
                )}

                
            </Card.Footer>
        </Card>
    );
};

export default MyListing;

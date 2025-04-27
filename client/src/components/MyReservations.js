import React, { useState } from "react";
import { Container, Button, Row, Col, Spinner, Alert, Card, Modal } from 'react-bootstrap';
import { Link } from "react-router-dom";

const MyReservations = ({ reservation }) => {
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);

    const {
        _id,
        lessonType,
        selectedDate,
        selectedTime,
        comment,
        status,
        listingId,
    } = reservation;

    const date = new Date(selectedDate).toLocaleDateString();

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <Card className="shadow-lg mb-3">
            {reservation.length !== 0 ? (
                <>
                    <Card.Body>
                        {listingId && (
                            <>
                                <Card.Title className="mb-2">
                                    <strong>Ogłoszenie: </strong>
                                    {listingId.title}
                                </Card.Title>
                                {listingId.teacher && (
                                    <Card.Text className="mb-2">
                                        <strong>Nauczyciel:</strong> {listingId.teacher.firstName} {listingId.teacher.lastName}
                                    </Card.Text>
                                )}
                            </>
                        )}
                        <Card.Text className="mb-1">
                            <strong>Data zajęć:</strong> {date}
                        </Card.Text>
                        <Card.Text className="mb-1">
                            <strong>Godzina zajęć:</strong> {selectedTime}
                        </Card.Text>
                    </Card.Body>
                    
                    <Card.Footer className="d-flex justify-content-end align-items-center gap-2">
                        <Button variant="primary" onClick={handleShowModal}>
                            Zobacz szczegóły
                        </Button>
                        {listingId && (
                            <Link to={`/ogloszenia/${listingId._id}`}>
                                <Button variant="secondary">Zobacz ogłoszenie</Button>
                            </Link>
                        )}
                        {listingId.teacher._id && (
                            <Link to={`/wiadomosc/${listingId.teacher._id}`}>
                                <Button variant="dark">Zadaj pytanie</Button>
                            </Link>
                        )}
                    </Card.Footer>
                </>
            ) : (
                <Card.Body>
                    <p>Nie masz żadnych rezerwacji</p>
                </Card.Body>
            )}

            {/* Okienko z szczegółami */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Szczegóły rezerwacji</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> <strong>Typ zajęć:</strong> {lessonType}</p>
                    {listingId.teacher && lessonType === 'Stacjonarnie' && (
                        <p><strong>Lokalizacja zajęć:</strong> {listingId.teacher.city} {listingId.address}</p>
                        )}
                    {comment && (
                               <p><strong>Opis: </strong>{comment.length > 50 ? `${comment.substring(0, 50)}...` : comment}</p>
                        )}
                    <p><strong>Status:</strong> {status}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Zamknij
                    </Button>
                </Modal.Footer>
            </Modal>
        </Card>
    );
}

export default MyReservations;

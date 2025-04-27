import React from 'react';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { FaMoneyBillWave, FaBook, FaMapMarkerAlt, FaCalendar } from 'react-icons/fa';


const ReservationCard = ({ reservation, announcement, handleStatusChange }) => { 
    return (
        <Card className="shadow-lg">
            <Card.Body>  
                <Col md={8}>
                    <Card.Title className="me-2 mt-2"><strong>Dane dotyczące rezerwacji</strong></Card.Title>
                    <Card.Subtitle className="mt-3 mb-2"><strong>Tytuł ogłoszenia:</strong> {announcement.title}</Card.Subtitle>
                    <Card.Subtitle className="mb-1 mt-2">
                        <strong>Przedmiot: </strong>
                        {announcement.subject}
                    </Card.Subtitle>
                    <Card.Text className="mb-1">
                        <strong>Stawka godzinowa: </strong>
                        {announcement.pricePerHour} zł/h
                    </Card.Text>
                    <Card.Text className="mb-1">
                        <strong>Lokalizacja: </strong>
                        {announcement.city + ', ' + announcement.state}
                    </Card.Text>
                    <Card.Text className="mb-1"><strong>Uczeń:</strong> {reservation.firstName} {reservation.lastName}</Card.Text>
                    <Card.Text className="mb-1 mt-1"><strong>Data: </strong>{new Date(reservation.selectedDate).toLocaleDateString()} </Card.Text> 
                    <Card.Text className="mb-1"><strong>Godzina: </strong>{reservation.selectedTime}</Card.Text>
                    <Card.Text className="mb-1 mt-1">
                        <strong>Status: </strong> {reservation.status}
                    </Card.Text>
                </Col>
                {reservation.status === 'Oczekujące na potwierdzenie' && (
                    <Row className="d-flex flex-column align-items-end mb-2">
                        <Col md="auto">
                            <Button 
                                variant="success" 
                                className="me-1" 
                                onClick={() => handleStatusChange(reservation, 'Potwierdzone')}
                            >
                                Zaakceptuj
                            </Button>
                            <Button 
                                variant="danger" 
                                className="me-1" 
                                onClick={() => handleStatusChange(reservation, 'Anulowane')}
                            >
                                   Anuluj
                            </Button>
                        </Col>
                    </Row>)}
            </Card.Body>
        </Card>
    );
}


export default ReservationCard;


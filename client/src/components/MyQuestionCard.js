import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaUser, FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyQuestionCard = ({ question, onEdit, onDelete }) => {
    const {
        _id,
        title,
        subject,
        description,
        student,
        comment,
    } = question;

    const commentCount = comment.length;

    return (
        <Card className="shadow-lg">
            <Card.Body>
                <Card.Title className="me-2">{title}</Card.Title>
                <Card.Subtitle className="mb-1 mt-2 text-muted">
                    {subject}
                </Card.Subtitle>
                <Card.Text className="mb-1">
                    <FaUser className="me-2" />
                    {student.firstName} {student.lastName}
                </Card.Text>
                <Card.Text className="mt-2">{description.substring(0, 100)}...</Card.Text>
                <Card.Text className="mt-2">
                    <FaComments className="me-2" />
                    {commentCount} Odpowiedzi
                </Card.Text>
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
                <Link to={`/pytanie/${_id}`}>
                    <Button variant="primary">Zobacz szczegóły</Button>
                </Link>
            </Card.Footer>
        </Card>
    );
};

export default MyQuestionCard;

import React from "react";
import { Card, Col, Button, Row } from "react-bootstrap";
import ProfilePicture from "./ProfilePicture";
import { Link } from "react-router-dom";

const QuestionCard = ({ question }) => {
  const student = question.student;

  return (
    <Card className="shadow p-3 h-100">
      <Card.Body>
        <Row>
          <Col md={1} className="my-auto me-3">
            {student ? (
              <ProfilePicture user={student} size={80} />
            ) : (
              <ProfilePicture user={null} size={80} defaultAvatar />
            )}
          </Col>

          <Col md={9}>
            <Card.Title>
              <Link
                to={`/questions/${question._id}`}
                className="text-decoration-none text-dark"
              >
                {question?.title || "Brak tytułu"}
              </Link>
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {student
                ? `${student.firstName} ${student.lastName}`
                : "Usunięty użytkownik"}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2">
              {question?.subject || "Brak przedmiotu"}
            </Card.Subtitle>
            <Card.Text className="mb-2">
              {question.description
                ? `${question.description.substring(0, 50)}...`
                : "Brak opisu."}
            </Card.Text>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="d-flex justify-content-end">
        <Link to={`/pytanie/${question._id}`}>
          <Button variant="primary">Zobacz szczegóły</Button>
        </Link>
      </Card.Footer>
    </Card>
  );
};

export default QuestionCard;

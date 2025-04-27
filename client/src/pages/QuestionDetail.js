import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import QuestionAnswerCard from "../components/QuestionAnswerCard";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import ProfilePicture from "../components/ProfilePicture";

const QuestionDetail = () => {
  const { user, isAuthenticated, userRole } = useContext(AuthContext);
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    comment: "",
  });

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {}
      };
      if (token) {
        config.headers['x-auth-token'] = token;
      }

      const res = await axios.get(`/api/questions/${questionId}`, config);
      setQuestion(res.data.question);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Brak tokenu uwierzytelniającego. Zaloguj się ponownie.");
        return;
      }

      if (!isAuthenticated || userRole !== "Nauczyciel") {
        setError('Nie masz uprawnień do dodania odpowiedzi!');
        return;
      }

      if (!question.student) {
        setError('Nie można dodać odpowiedzi, ponieważ dane studenta są niedostępne.');
        return;
      }

      const config = {
        headers: { 'x-auth-token': token },
      };

      await axios.post(`/api/questions/${questionId}/answers`, {
        comment: formData.comment,
      }, config);

      setError('');
      setFormData({ comment: "" }); 
      fetchQuestion();
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd.');
      }
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  if (loading) {
    return (
      <Container className="my-5 d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Ładowanie...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Link to="/pytania/uczniowie" className="btn btn-secondary">
          &larr; Powrót do pytań
        </Link>
      </Container>
    );
  }

  if (!question) {
    return (
      <Container className="my-5">
        <Alert variant="warning">Pytanie nie zostało znalezione.</Alert>
        <Link to="/pytania/uczniowie" className="btn btn-secondary">
          &larr; Powrót do pytań
        </Link>
      </Container>
    );
  }

  return (
    <Container className="my-5 ">
      <Link to="/pytania/uczniowie" className="btn btn-secondary mb-4">
        &larr; Powrót do pytań
      </Link>
      <Card className="shadow">
        <Card className="mb-3">
          <Card.Header className="d-flex align-items-center">
            {question.student ? (
              <>
                <ProfilePicture user={question.student} size={60} />
                <div className="ms-3">
                  <h5 className="mb-0">
                    {question.student.firstName} {question.student.lastName}
                  </h5>
                  <small className="text-muted">
                    {new Date(question.createdAt).toLocaleString()}
                  </small>
                </div>
              </>
            ) : (
              <Row className="w-100">
                <Col>
                  <Alert variant="warning" className="w-100 text-center">
                    Dane studenta są niedostępne.
                  </Alert>
                </Col>
              </Row>
            )}
          </Card.Header>
          <Card.Body>
            <Row>
              <Col>
                <p>{question.description || "Brak opisu."}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <QuestionAnswerCard question={question} onUpdate={fetchQuestion} />

      </Card>
      {isAuthenticated && userRole === "Nauczyciel" && question.student && (
        <Card className="mt-4 shadow">
          <Card.Header>Dodaj odpowiedź</Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="comment" className="mb-3">
                <Form.Label>Treść odpowiedzi</Form.Label>
                <Form.Control
                  as="textarea"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Wpisz swoją odpowiedź tutaj..."
                  required
                />
              </Form.Group>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit">
                  Dodaj odpowiedź
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
      {isAuthenticated && userRole === "Nauczyciel" && !question.student && (
        <Alert variant="warning" className="mt-4">
          Nie możesz dodać odpowiedzi, ponieważ dane studenta są niedostępne.
        </Alert>
      )}
    </Container>
  );
};

export default QuestionDetail;

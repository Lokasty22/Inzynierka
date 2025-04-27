import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import MyQuestionCard from "../components/MyQuestionCard";
import EditQuestionModal from "../components/EditQuestionModal";
import { Container, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import PaginationSection from "../components/PaginationSection";

const MyQuestionsPage = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Pobieranie pytań użytkownika

  const fetchUserListings = async () => {
    if (!user) return;
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/users/${user._id}/questions`, {
        headers: { "x-auth-token": token },
      });
      setQuestions(res.data);
    } catch (err) {
      setError("Błąd podczas pobierania Twoich pytań.");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserListings();
  }, [user, page]);

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/questions/${id}`, {
        headers: { "x-auth-token": token },
      });
      setQuestions(questions.filter((question) => question._id !== id));
    } catch (err) {
      setError("Błąd podczas usuwania pytania.");
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setSelectedQuestion(null);
    fetchUserListings();
  };

  if (loading || fetching) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Ładowanie pytań...</p>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="my-5">
        <Alert variant="warning">
          Musisz być zalogowany, aby zobaczyć tę stronę.
        </Alert>
      </Container>
    );
  }

  const currentPage = (page - 1) * 10;
  const currentListings = questions.slice(currentPage, currentPage + 10);

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Moje Pytania</h2>
        </Col>
        <Col className="text-end">
          <Link to="/dodaj-pytanie">
            <Button variant="primary">Dodaj Nowe Pytanie</Button>
          </Link>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {questions.length === 0 ? (
        <p>Nie masz jeszcze żadnych pytań. Dodaj nowe pytanie!</p>
      ) : (
        currentListings.map((question) => (
          <div key={question._id} className="mb-4">
            <MyQuestionCard
              question={question}
              onEdit={() => handleEdit(question)}
              onDelete={() => handleDelete(question._id)}
            />
          </div>
        ))
      )}
      {showEditModal && selectedQuestion && (
        <EditQuestionModal
          show={showEditModal}
          onHide={handleModalClose}
          question={selectedQuestion}
        />
      )}
      {}
      <PaginationSection page={page} setPage={setPage} listings={questions} />
    </Container>
  );
};

export default MyQuestionsPage;


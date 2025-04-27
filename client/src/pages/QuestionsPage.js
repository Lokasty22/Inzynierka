import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Form, Link } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import QuestionCard from "../components/QuestionCard";
import { AuthContext } from "../context/AuthContext";
import PaginationSection from "../components/PaginationSection";

const QuestionsPage = () => {
  const {isAuthenticated, userRole} = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/questions/`);
      setQuestions(res.data.questions);
    } catch (error) {
      console.error("Error podczas pobierania pytań:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page]);

  const currentPage = page * 10 - 10;
  const paginatedQuestions = questions.slice(currentPage, 10 * page);

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between">
      <h2>Pytania uczniów</h2>
      {isAuthenticated && userRole === 'Uczeń' && (
      <Link to="/dodaj-pytanie">
        <Button variant="primary" className="mb-3">Dodaj pytanie</Button>
      </Link>
      )}
      </div>
      {paginatedQuestions.map((question) => (
        <div key={question._id} className="mb-4">
          <QuestionCard question={question} onUpdate={fetchQuestions}/>
        </div>
      ))}
      <PaginationSection page={page} setPage={setPage} listings={questions} />  
    </Container>
  );
};

export default QuestionsPage;

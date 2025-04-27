import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('/api/admin/questions');
      setQuestions(res.data.questions);
    } catch (error) {
      console.error('Błąd podczas pobierania pytań:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć to pytanie?')) {
      try {
        await axios.delete(`/api/admin/questions/${id}`);
        fetchQuestions();
      } catch (error) {
        console.error('Błąd podczas usuwania pytania:', error);
      }
    }
  };

  return (
    <div className="container my-5">
      <h1>Zarządzaj pytaniami</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tytuł</th>
            <th>Uczeń</th>
            <th>Przedmiot</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question._id}>
              <td>{question.title}</td>
              <td>{`${question.student.firstName} ${question.student.lastName}`}</td>
              <td>{question.subject}</td>
              <td>
                <Button variant="primary" onClick={() => navigate(`/pytanie/${question._id}`)}>
                  Podgląd
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(question._id)}>
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminQuestions;

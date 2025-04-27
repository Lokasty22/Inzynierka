import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Alert, Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import SubjectList from "../components/SubjectList";

const CreateQuestionPage = () => {
  const { user, userRole, isAuthenticated } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const setSubjectValue = (value) => {
    handleChange({
      target: {
        name: "subject",
        value: value,
      },
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError('Brak tokena uwierzytalniającego.')
        return;
      }

      if(!isAuthenticated || userRole !== 'Uczeń'){
        setError('Nie masz uprawnień do dodania pytania.');
        return;
      }

      const regexTitle = /^.{10,20}$/;
      const regexDescription = /^.{15,500}$/;


      const dataToSend = {
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
      };

      if(!regexTitle.test(formData.title)){
        setError('Błędny tytuł! Tytuł musi zawierać co najmniej 10 znaków, ale mniej niż 20.')
        return;
      }

      if(!regexDescription.test(formData.description)){
        setError('Błędny opis! Opis musi zawierać co najmniej 15 znaków, ale mniej niż 500.');
        return;
      }

      await axios.post(`/api/questions`, dataToSend, {
        headers: { "x-auth-token": token },
      });
      setError('');
      setSuccess('Wiadomosć została dodana!');
    } catch (error) {
      if(error.response && error.response.status >= 400 && error.response.status <= 500){
        setError(error.response.data.message);
      }
      console.error("Błąd podczas wysyłania pytania.");
    }
  };

  return (
    <Container className="my-5">
      <h1>Dodaj pytanie</h1>
      <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Tytuł</Form.Label>
          <Form.Control
            text="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="subject" className="mb-3">
            <Form.Label>Przedmiot</Form.Label>
            <SubjectList subject={formData.subject} setSubject={setSubjectValue} />
        </Form.Group>
        <Form.Group controlId="description" className="mb-3">
            <Form.Label>Opis</Form.Label>
            <Form.Control
            text="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required/>
        </Form.Group>
        <Button variant="primary" type="submit">
            Dodaj pytanie
        </Button>
      </Form>
    </Container>
  );
};

export default CreateQuestionPage;
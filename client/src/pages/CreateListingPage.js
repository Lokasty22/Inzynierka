import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Accordion } from "react-bootstrap";

const subjects = [
  "Matematyka",
  "Fizyka",
  "Chemia",
  "Biologia",
  "Geografia",
  "Historia",
  "Wiedza o społeczeństwie",
  "Angielski",
  "Polski",
  "Niemiecki",
  "Hiszpański",
  "Francuski",
  "Włoski",
  "Łacina",
  "Filozofia",
  "Muzyka",
  "Gra na instrumencie",
  "Zajęcia sportowe",
];
const daysOfWeek = [
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
  "Niedziela",
];

const CreateListingPage = () => {
  const { isAuthenticated, userRole, loading } = useContext(AuthContext);
  const [validationError, setValidationError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    title: "",
    description: "",
    pricePerHour: "",
    availability: {},
    teachingScope: "",
    experience: "",
    education: "",
    state: "",
    city: "",
    mode: "Online", // Domyślny tryb to Online
    address: "", // Adres początkowo pusty
  });

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Brak tokena");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          headers: {
            "x-auth-token": token,
          },
        });

        const userData = response.data;
        setFormData({
          ...formData,
          state: userData.state || "",
          city: userData.city || "",
        });
      } catch (error) {
        console.error("Nie udało się pobrać danych użytkownika:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidationError("");
    setSuccessMessage("");
  };

  const handleAvailabilityChange = (day, time) => {
    setFormData((prevData) => {
      const currentDayAvailability = prevData.availability[day] || [];
      const isSelected = currentDayAvailability.includes(time);

      const updatedDayAvailability = isSelected
        ? currentDayAvailability.filter((t) => t !== time)
        : [...currentDayAvailability, time];

      return {
        ...prevData,
        availability: {
          ...prevData.availability,
          [day]: updatedDayAvailability,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const regexTitle = /^.{10,}$/;

    if (!regexTitle.test(formData.title)) {
      setValidationError("Tytuł musi zawierać co najmniej 10 znaków.");
      return;
    }

    if (!regexTitle.test(formData.description)) {
      setValidationError("Opis musi zawierać co najmniej 10 znaków.");
      return;
    }

    const regexPrice = /^\d+$/;

    if (!regexPrice.test(formData.pricePerHour)) {
      setValidationError("Cena musi być liczbą.");
      return;
    }

    if (formData.pricePerHour < 0) {
      setValidationError("Cena nie może być ujemna.");
      return;
    }

    if (!formData.state || !formData.city) {
      setValidationError(
        "Województwo i miasto są wymagane. Uzupełnij je w ustawieniach konta.",
      );
      return;
    }

    if (!isAuthenticated || userRole !== "Nauczyciel") {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Brak tokena");
        return;
      }

      const transformedAvailability = Object.entries(formData.availability)
        .filter(([day, times]) => times.length > 0)
        .map(([day, times]) => ({ day, times }));

      if (transformedAvailability.length === 0) {
        setValidationError("Wybierz godzinę dostępności!");
        return;
      }

      const dataToSend = {
        subject: formData.subject,
        title: formData.title,
        description: formData.description,
        pricePerHour: Number(formData.pricePerHour),
        availability: transformedAvailability,
        teachingScope: formData.teachingScope,
        experience: formData.experience,
        education: formData.education,
        state: formData.state,
        city: formData.city,
        mode: formData.mode,
        address: (formData.mode === "Stacjonarnie" || formData.mode === "Stacjonarnie i Online") 
        ? formData.address 
        : "", 
      };

      await axios.post("/api/listings", dataToSend, {
        headers: { "x-auth-token": token },
      });

      setSuccessMessage("Ogłoszenie zostało dodane.");

      navigate("/ogloszenia/korepetytorzy");
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (!isAuthenticated || userRole !== "Nauczyciel") {
    return <p>Nie masz uprawnień do tworzenia ogłoszeń.</p>;
  }

  return (
    <Container className="my-5">
      <h1>Dodaj Ogłoszenie</h1>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="subject" className="mb-3">
          <Form.Label>Przedmiot</Form.Label>
          <Form.Select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Wybierz przedmiot</option>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="title" className="mb-3">
          <Form.Label>Tytuł</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Opis</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="pricePerHour" className="mb-3">
          <Form.Label>Cena za godzinę (zł)</Form.Label>
          <Form.Control
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        <Form.Group controlId="mode" className="mb-3">
          <Form.Label>Tryb</Form.Label>
          <Form.Select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            required
          >
            <option value="Online">Online</option>
            <option value="Stacjonarnie">Stacjonarnie</option>
            <option value="Stacjonarnie i Online">Stacjonarnie i Online</option>
          </Form.Select>
        </Form.Group>

        {/* Wyświetl adres tylko, jeśli tryb jest 'Stacjonarnie' */}
        {(formData.mode === "Stacjonarnie" || formData.mode === "Stacjonarnie i Online") && (
          <Form.Group controlId="address" className="mb-3">
            <Form.Label>Adres</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required={formData.mode === "Stacjonarnie" || formData.mode === "Stacjonarnie i Online"}
            />
          </Form.Group>
        )}


        <Form.Group controlId="state" className="mb-3">
          <Form.Label>Województwo</Form.Label>
          <Form.Control
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            disabled
          />
        </Form.Group>

        <Form.Group controlId="city" className="mb-3">
          <Form.Label>Miasto</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            disabled
          />
        </Form.Group>

        <Form.Group controlId="availability" className="mb-3">
          <Form.Label>Dostępność</Form.Label>
          <Accordion>
            {daysOfWeek.map((day, index) => (
              <Accordion.Item eventKey={index.toString()} key={day}>
                <Accordion.Header>{day}</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    {[...Array(13).keys()].map((i) => {
                      const hour = i + 8;
                      const time = `${hour}:00`;
                      const isSelected =
                        formData.availability[day]?.includes(time);
                      return (
                        <Col className="gx-1" key={time}>
                          <Col xs={3} sm={2} md={1} className="mb-2">
                            <Button
                              variant={
                                isSelected ? "success" : "outline-secondary"
                              }
                              size="sm"
                              onClick={() =>
                                handleAvailabilityChange(day, time)
                              }
                            >
                              {time}
                            </Button>
                          </Col>
                        </Col>
                      );
                    })}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Form.Group>

        <Form.Group controlId="teachingScope" className="mb-3">
          <Form.Label>Zakres nauczania (opcjonalnie)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="teachingScope"
            value={formData.teachingScope}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="experience" className="mb-3">
          <Form.Label>Doświadczenie (opcjonalnie)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="education" className="mb-3">
          <Form.Label>Wykształcenie (opcjonalnie)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
        </Form.Group>

        {validationError && (
          <div
            className="alert alert-danger"
            role="alert"
            data-testid="validation-error"
          >
            {validationError}
          </div>
        )}
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
            data-testid="error-message"
          >
            {error}
          </div>
        )}
        {successMessage && (
          <div
            className="alert alert-success"
            role="alert"
            data-testid="success-message"
          >
            {successMessage}
          </div>
        )}

        <Button variant="primary" type="submit">
          Dodaj Ogłoszenie
        </Button>
      </Form>
    </Container>
  );
};

export default CreateListingPage;

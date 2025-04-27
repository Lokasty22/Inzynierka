import React from "react";
import { Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import StateList from "./StateList"; 
import CityList from "./CityList";  

const PersonalDataForm = ({
  user,
  formData,
  isEditing,
  handleChange,
  handleEdit,
  handleSubmit,
  handleDeleteAccount,
  profileSuccess,
  profileError,
}) => {
  const setStateValue = (value) => {
    handleChange({
      target: {
        name: "state",
        value: value,
      },
    });
  };

  const setCityValue = (value) => {
    handleChange({
      target: {
        name: "city",
        value: value,
      },
    });
  };

  return (
    <Card className="mb-1 shadow-sm">
      <Card.Body>
        <Card.Header>
          <h5 className="mb-2">Dane osobowe</h5>
        </Card.Header>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="firstName" className="mb-3 mt-3">
                <Form.Label>Imię</Form.Label>
                <Form.Control
                  type="text"
                  value={user?.firstName || ""}
                  disabled
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="lastName" className="mb-3 mt-3">
                <Form.Label>Nazwisko</Form.Label>
                <Form.Control
                  type="text"
                  value={user?.lastName || ""}
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="gender" className="mb-3">
            <Form.Label>Płeć</Form.Label>
            <Form.Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
            >
              <option value="">Wybierz płeć</option>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
              <option value="other">Inne</option>
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="birthDate" className="mb-3">
            <Form.Label>Data urodzenia</Form.Label>
            <Form.Control
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>
          <Card.Header>
            <h5 className="mt-2">Dane kontaktowe</h5>
          </Card.Header>

          <Form.Group controlId="phoneNumber" className="mb-3 mt-3">
            <Form.Label>Telefon</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={user?.email || ""} disabled />
          </Form.Group>

          <Row>
            <Col md={4}>
              <Form.Group controlId="country" className="mb-3">
                <Form.Label>Kraj</Form.Label>
                <Form.Select
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                >
                  <option value="">Wybierz kraj</option>
                  <option value="Polska">Polska</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="state" className="mb-3">
                <Form.Label>Województwo</Form.Label>
                <StateList
                  state={formData.state}
                  setState={setStateValue}
                  disabled={!isEditing}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="city" className="mb-3">
                <Form.Label>Miejscowość</Form.Label>
                <CityList
                  city={formData.city}
                  setCity={setCityValue}
                  disabled={!isEditing}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="bio" className="mb-3">
            <Form.Label>O mnie</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <div>
              <Button variant="secondary" className="me-2" onClick={handleEdit}>
                {isEditing ? "Anuluj" : "Edytuj"}
              </Button>
              {isEditing && (
                <Button variant="primary" type="submit">
                  Zapisz zmiany
                </Button>
              )}
            </div>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Usuń konto
            </Button>
          </div>
        </Form>

        {profileSuccess && (
          <Alert variant="success" className="mt-3">
            {profileSuccess}
          </Alert>
        )}
        {profileError && (
          <Alert variant="danger" className="mt-3">
            {profileError}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default PersonalDataForm;

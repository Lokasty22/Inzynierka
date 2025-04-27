import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOpinions = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({});

  const [editingOpinion, setEditingOpinion] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchOpinions = useCallback(async () => {
    if (isAuthenticated && userRole === "Admin") {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const params = { ...appliedFilters };

        const response = await axios.get("/api/admin/opinions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        });

        setOpinions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Błąd podczas pobierania opinii:", err);
        setError("Nie udało się pobrać opinii.");
        setLoading(false);
      }
    }
  }, [isAuthenticated, userRole, appliedFilters]);

  useEffect(() => {
    fetchOpinions();
  }, [fetchOpinions]);

  const handleDeleteOpinion = async (opinia) => {
    const reviewId = opinia.reviewId || opinia._id;
    console.log("Próba usunięcia opinii o reviewId:", reviewId);

    if (!window.confirm("Czy na pewno chcesz usunąć tę opinię?")) return;

    try {
      const token = localStorage.getItem("token");
      console.log("Wysyłanie żądania DELETE na /api/admin/opinions/", reviewId);
      await axios.delete(`/api/admin/opinions/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Odebrano odpowiedź od serwera");
      toast.success("Opinia została usunięta.");
      fetchOpinions(); // Odświeżenie listy opinii
    } catch (err) {
      console.error(
        "Błąd podczas usuwania opinii:",
        err.response ? err.response.data : err,
      );
      toast.error("Nie udało się usunąć opinii.");
    }
  };

  const handleEditOpinion = (opinia) => {
    setEditingOpinion(opinia);
    setEditComment(opinia.comment);
    setEditRating(opinia.rating);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { reviewId } = editingOpinion;
      const token = localStorage.getItem("token");

      const updatedData = {
        comment: editComment,
        rating: parseInt(editRating),
      };

      await axios.put(`/api/admin/opinions/${reviewId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Opinia została zaktualizowana.");
      setShowEditModal(false);
      setEditingOpinion(null);
      setEditComment("");
      setEditRating("");
      fetchOpinions();
    } catch (err) {
      console.error(
        "Błąd podczas edycji opinii:",
        err.response ? err.response.data : err,
      );
      toast.error("Nie udało się edytować opinii.");
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();

    const filters = {};
    if (ratingFilter) filters.rating = ratingFilter;
    if (startDateFilter) filters.startDate = startDateFilter;
    if (endDateFilter) filters.endDate = endDateFilter;
    if (firstNameFilter) filters.firstName = firstNameFilter;
    if (lastNameFilter) filters.lastName = lastNameFilter;

    setAppliedFilters(filters);
  };

  const handleClearFilters = () => {
    setFirstNameFilter("");
    setLastNameFilter("");
    setRatingFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setAppliedFilters({});
  };

  if (!isAuthenticated || userRole !== "Admin") {
    return <p>Brak dostępu.</p>;
  }

  if (loading) return <p>Ładowanie opinii...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container my-5">
      <h2>Zarządzanie Opiniami</h2>

      <Form className="mb-4" onSubmit={handleFilterSubmit}>
        <Row>
          <Col md={2}>
            <Form.Group controlId="filterRating">
              <Form.Label>Ocena</Form.Label>
              <Form.Control
                as="select"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="">Wszystkie</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterStartDate">
              <Form.Label>Data Od</Form.Label>
              <Form.Control
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterEndDate">
              <Form.Label>Data Do</Form.Label>
              <Form.Control
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="filterFirstName">
              <Form.Label>Imię Autora</Form.Label>
              <Form.Control
                type="text"
                placeholder="Imię"
                value={firstNameFilter}
                onChange={(e) => setFirstNameFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="filterLastName">
              <Form.Label>Nazwisko Autora</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nazwisko"
                value={lastNameFilter}
                onChange={(e) => setLastNameFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12} className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClearFilters}
              className="me-2"
            >
              Wyczyść filtry
            </Button>
            <Button variant="primary" type="submit">
              Filtruj
            </Button>
          </Col>
        </Row>
      </Form>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tytuł Ogłoszenia</th>
            <th>Autor Opinii</th>
            <th>Komentarz</th>
            <th>Ocena</th>
            <th>Data Utworzenia</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {opinions.map((opinia) => {
            const reviewId = opinia.reviewId || opinia._id;
            return (
              <tr key={reviewId}>
                <td>{opinia.listingTitle}</td>
                <td>
                  {opinia.student
                    ? `${opinia.student.firstName} ${opinia.student.lastName}`
                    : "Anonim"}
                </td>
                <td>{opinia.comment}</td>
                <td>{opinia.rating}</td>
                <td>{new Date(opinia.createdAt).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleEditOpinion(opinia)}
                  >
                    Edytuj
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteOpinion(opinia)}
                  >
                    Usuń
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {editingOpinion && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edycja Opinii</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleEditSubmit}>
            <Modal.Body>
              <Form.Group controlId="editComment">
                <Form.Label>Komentarz</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  required
                  minLength={10}
                />
              </Form.Group>
              <Form.Group controlId="editRating" className="mt-3">
                <Form.Label>Ocena</Form.Label>
                <Form.Control
                  as="select"
                  value={editRating}
                  onChange={(e) => setEditRating(e.target.value)}
                  required
                >
                  <option value="">Wybierz ocenę</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Zamknij
              </Button>
              <Button variant="primary" type="submit">
                Zapisz Zmiany
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
};
export default AdminOpinions;

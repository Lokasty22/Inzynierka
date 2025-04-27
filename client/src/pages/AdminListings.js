import React, { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Table, Button, Modal, Col, Row, Form } from "react-bootstrap";

const AdminListings = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({});
  const [titleFilter, setTitleFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [teacherNameFilter, setTeacherNameFilter] = useState("");

  const fetchListings = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const params = { ...filters };
      const res = await axios.get("/api/admin/listings", {
        headers: { "x-auth-token": token },
        params: params,
      });
      setListings(res.data);
    } catch (error) {
      console.error("Błąd podczas pobierania ogłoszeń:", error);
    }
  }, [filters]);

  useEffect(() => {
    if (isAuthenticated && userRole === "Admin") {
      fetchListings();
    }
  }, [fetchListings, isAuthenticated, userRole]);

  const handleDelete = async (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć to ogłoszenie?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/api/admin/listings/${id}`, {
          headers: { "x-auth-token": token },
        });
        setListings(listings.filter((listing) => listing._id !== id));
      } catch (error) {
        console.error("Błąd podczas usuwania ogłoszenia:", error);
      }
    }
  };

  const handleViewDetails = (listing) => {
    setSelectedListing(listing);
    setShowModal(true);
  };

  if (!isAuthenticated || userRole !== "Admin") {
    return <p>Brak dostępu.</p>;
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault();

    const filtersApplied = {};
    if (titleFilter) filtersApplied.titleFilter = titleFilter;
    if (subjectFilter) filtersApplied.subjectFilter = subjectFilter;
    if (teacherNameFilter) filtersApplied.teacherNameFilter = teacherNameFilter;

    setFilters(filtersApplied);
  };

  const handleClearFilters = () => {
    setTitleFilter("");
    setSubjectFilter("");
    setTeacherNameFilter("");
    setFilters({});
  };

  return (
    <div className="container my-5">
      <h2>Zarządzaj ogłoszeniami</h2>
      <Form className="mb-4" onSubmit={handleFilterSubmit}>
        <Row>
          <Col md={2}>
            <Form.Group controlId="filterTitle">
              <Form.Label>Tytuł</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tytuł"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterSubject">
              <Form.Label>Przedmiot</Form.Label>
              <Form.Control
                type="text"
                placeholder="Przedmiot"
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterTeacher">
              <Form.Label>Nauczyciel</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nauczyciel"
                value={teacherNameFilter}
                onChange={(e) => setTeacherNameFilter(e.target.value)}
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
            <th>Tytuł</th>
            <th>Przedmiot</th>
            <th>Nauczyciel</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing._id}>
              <td>{listing.title}</td>
              <td>{listing.subject}</td>
              <td>
                {`${listing.teacher?.firstName || ""} ${
                  listing.teacher?.lastName || ""
                }`}
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewDetails(listing)}
                >
                  Szczegóły
                </Button>{" "}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(listing._id)}
                >
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedListing && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Szczegóły ogłoszenia</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{selectedListing.title}</h4>
            <p>
              <strong>Przedmiot:</strong> {selectedListing.subject}
            </p>
            <p>
              <strong>Nauczyciel:</strong>{" "}
              {`${selectedListing.teacher?.firstName || ""} ${
                selectedListing.teacher?.lastName || ""
              }`}
            </p>
            <p>
              <strong>Opis:</strong> {selectedListing.description}
            </p>
            <p>
              <strong>Cena za godzinę:</strong> {selectedListing.pricePerHour}{" "}
              zł
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Zamknij
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(selectedListing._id)}
            >
              Usuń ogłoszenie
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminListings;

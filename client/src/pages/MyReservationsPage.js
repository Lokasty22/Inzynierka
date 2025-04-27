import React, { useEffect, useState, useContext } from "react";
import MyReservations from "../components/MyReservations";
import MyListing from "../components/MyListings";
import {
  Container,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PaginationSection from "../components/PaginationSection";

const MyReservationsPage = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);

  // Pobieranie rezerwacji użytkownika

  const fetchUserReservations = async () => {
    if (!user) {
      return;
    }
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/reservations/user`, {
        headers: { "x-auth-token": token },
      });
      setReservations(res.data);
    } catch (err) {
      setError("Błąd podczas pobierania Twoich rezerwacji.");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserReservations();
  }, [user, page]);

  if (loading || fetching) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3"> Ładowanie ogłoszeń... </p>
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
  const currentReservations = reservations.slice(currentPage, currentPage + 10);

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Moje rezerwacje</h2>
        </Col>
      </Row>
      <Col>
        {reservations.length === 0 ? (
          <p>Nie masz jeszcze żadnych rezerwacji. Utwórz je!</p>
        ) : (
          currentReservations.map((reservation) => (
            <MyReservations key={reservation._id} reservation={reservation} />
          ))
        )}
      </Col>
      <PaginationSection
        page={page}
        setPage={setPage}
        listings={reservations}
      />
    </Container>
  );
};

export default MyReservationsPage;


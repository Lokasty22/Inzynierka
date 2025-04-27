import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import MyListingCard from "../components/MyListings";
import EditListingModal from "../components/EditMyListings";
import { Container, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import PaginationSection from "../components/PaginationSection";

const MyListingsPage = () => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Pobieranie ogłoszeń użytkownika

  const fetchUserListings = async () => {
    if (!user) return;
    setFetching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`/api/users/${user._id}/listings`, {
        headers: { "x-auth-token": token },
      });
      setListings(res.data);
    } catch (err) {
      setError("Błąd podczas pobierania Twoich ogłoszeń.");
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserListings();
  }, [user, page]);

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setShowEditModal(true);
  };

  const handleDelete = async (listingId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/listings/${listingId}`, {
        headers: { "x-auth-token": token },
      });
      setListings(listings.filter((listing) => listing._id !== listingId));
    } catch (err) {
      setError("Błąd podczas usuwania ogłoszenia.");
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setShowEditModal(false);
    setSelectedListing(null);
    fetchUserListings();
  };

  if (loading || fetching) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Ładowanie ogłoszeń...</p>
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
  const currentListings = listings.slice(currentPage, currentPage + 10);

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <Col>
          <h2>Moje Ogłoszenia</h2>
        </Col>
        <Col className="text-end">
          <Link to="/dodaj-ogloszenie">
            <Button variant="primary">Dodaj Nowe Ogłoszenie</Button>
          </Link>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {listings.length === 0 ? (
        <p>Nie masz jeszcze żadnych ogłoszeń. Dodaj nowe ogłoszenie!</p>
      ) : (
        currentListings.map((listing) => (
          <div key={listing._id} className="mb-4">
            <MyListingCard
              listing={listing}
              onEdit={() => handleEdit(listing)}
              onDelete={() => handleDelete(listing._id)}
            />
          </div>
        ))
      )}
      {showEditModal && selectedListing && (
        <EditListingModal
          show={showEditModal}
          onHide={handleModalClose}
          listing={selectedListing}
        />
      )}
      {}
      <PaginationSection page={page} setPage={setPage} listings={listings} />
    </Container>
  );
};

export default MyListingsPage;


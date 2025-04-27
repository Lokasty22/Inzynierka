import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ListingCard from "../components/ListingCard";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, Button, Row, Col, Spinner } from "react-bootstrap";
import SearchBar from "../components/SearchBar";
import PaginationSection from "../components/PaginationSection";

const ListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [sortOption, setSortOption] = useState("");
  const [subject, setSubject] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [state, setState] = useState("");
  const { userRole, loading } = useContext(AuthContext);
  const [fetching, setFetching] = useState(true);
  useEffect(() => {
    setFetching(true);
    const fetchListings = async () => {
      try {
        const res = await axios.get(`/api/listings/`);
        setListings(res.data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchListings();
  }, [page]);

  const handleFilterSubmit = async (e) => {
    e.preventDefault();

    try {
      const query = new URLSearchParams();
      if (subject) query.append("subject", subject);
      if (city) query.append("city", city);
      if (state) query.append("state", state);
      if (page) query.append("page", page);
      const res = await axios.get(`/api/listings/?${query.toString()}`);
      let results = res.data;

      if (sortOption === "price-high") {
        results.sort((a, b) => b.pricePerHour - a.pricePerHour);
      } else if (sortOption === "price-low") {
        results.sort((a, b) => a.pricePerHour - b.pricePerHour);
      } else if (sortOption === "date-new") {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sortOption === "date-old") {
        results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      setListings(results);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  if (loading || fetching) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Ładowanie ogłoszeń...</p>
      </Container>
    );
  }

  const currentPage = page * 10 - 10;
  const paginatedListings = listings.slice(currentPage, 10 * page);

  return (
    <Container className="my-5">
      <Row className="mb-4 align-items-center">
        <div className="mb-4"></div>
        <SearchBar
        subject={subject}
          setSubject={setSubject}
          city={city}
          setCity={setCity}
          price={price}
          setPrice={setPrice}
          state={state}
          setState={setState}
          sortOption={sortOption}
          setSortOption={setSortOption}
          setPage={setPage}
          handleFilterSubmit={handleFilterSubmit}
        />
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Ogłoszenia Korepetytorów </h2>
          </div>
        </Col>
        {userRole === "Nauczyciel" && (
          <Col className="text-end">
            <Link to="/dodaj-ogloszenie">
              <Button variant="primary">Dodaj Ogłoszenie</Button>
            </Link>
          </Col>
        )}
      </Row>
      {paginatedListings.map((listing) => (
        <div key={listing._id} className="mb-4">
          <ListingCard listing={listing} />
        </div>
      ))}
      <PaginationSection page={page} setPage={setPage} listings={listings} />
    </Container>
  );
};

export default ListingsPage;

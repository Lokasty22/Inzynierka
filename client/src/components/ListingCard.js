import React from "react";
import { Link } from "react-router-dom";
import ProfilePicture from "./ProfilePicture";
import { Card, Button, Row, Col } from "react-bootstrap";
import {
  FaStar,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBook,
} from "react-icons/fa";

const ListingCard = ({ listing }) => {
  const {
    _id,
    teacher,
    subject,
    title,
    description,
    pricePerHour,
    city,
    state,
    rating,
    isPromoted,
    promotionEndDate,
  } = listing;  

  const teacherData = teacher ?? {};

  const today = new Date();
  const isStillPromoted =
    isPromoted && new Date(promotionEndDate) > today; 

  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar
      key={index}
      className={`me-1 ${index < Math.round(rating) ? "text-warning" : "text-muted"}`}
    />
  ));

  const cardStyle = isStillPromoted
  ? {
      border: "5px solid #ffc107", // Gruba żółta ramka
      borderRadius: "15px", // Zaokrąglenie rogów
    }
  : {};

return (
  <Card className="shadow p-3 h-100" style={cardStyle}>
    <Card.Body>
      <Row>
        <Col md={3} className="text-center my-auto">
          <ProfilePicture user={teacher} size={80} />
        </Col>
        <Col md={9}>
          <Card.Title>
            <Link
              to={`/listing/${_id}`}
              className="text-decoration-none text-dark"
            >
              {title}
            </Link>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {teacherData.firstName} {teacherData.lastName} &middot; <FaBook /> {subject}
          </Card.Subtitle>
          <Card.Text className="mb-2">
            <FaMapMarkerAlt /> {city}, {state} &nbsp; | &nbsp;
            <FaMoneyBillWave /> {pricePerHour} zł/h
          </Card.Text>
          <div className="mb-2">
            <strong>Ocena:</strong> {stars} ({rating.toFixed(1)}/5)
          </div>
          <div className="mb-2">
            <strong>Typ zajęć: </strong> {listing.mode}
          </div>
          <Card.Text>{description.substring(0, 150)}...</Card.Text>
        </Col>
      </Row>
    </Card.Body>
    <Card.Footer className="text-end">
      <Link to={`/ogloszenia/${_id}`}>
        <Button variant="primary">Zobacz szczegóły</Button>
      </Link>
    </Card.Footer>
  </Card>
);};

export default ListingCard;

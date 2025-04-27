import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ProfilePicture from "../components/ProfilePicture";
import ReviewForm from "./ReviewForm";
import ReviewItem from "../components/ReviewItem";
import AvailabilitySchedule from "../components/AvailabilitySchedule";
import { AuthContext } from "../context/AuthContext";
import { Card, Button, Row, Col } from "react-bootstrap";
import {
  FaStar,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBook,
  FaGraduationCap,
  FaBriefcase,
  FaChalkboardTeacher,
  FaCalendarAlt,
} from "react-icons/fa";

const ListingDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const fetchListing = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/listings/${id}`);
      setListing(res.data);
    } catch (err) {
      setError("Błąd podczas pobierania danych ogłoszenia.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="container my-5">Ładowanie...</div>;
  }

  if (error) {
    return <div className="container my-5 text-danger">{error}</div>;
  }

  if (!listing) {
    return (
      <div className="container my-5">Ogłoszenie nie zostało znalezione.</div>
    );
  }

  const {
    teacher,
    subject,
    title,
    description,
    pricePerHour,
    city,
    state,
    rating,
    reviews,
    availability,
    teachingScope,
    experience,
    education,
    mode,
  } = listing;

  const stars = Array.from({ length: 5 }, (_, index) => (
    <FaStar
      key={index}
      className={`me-1 ${index < Math.round(rating) ? "text-warning" : "text-muted"}`}
    />
  ));

  const userReview = isAuthenticated
    ? reviews.find((review) => review.student?._id === user?._id)
    : null;

  return (
    <div className="container my-5">
      <Link to="/ogloszenia/korepetytorzy" className="btn btn-secondary mb-4">
        &larr; Powrót do ogłoszeń
      </Link>
      <Card className="shadow-lg">
        <Card.Header>
          <Row className="align-items-center">
            <Col xs="auto">
              {teacher ? (
                <Link to={`/profil/${teacher._id}`}>
                  <ProfilePicture user={teacher} size={80} />
                </Link>
              ) : (
                <ProfilePicture user={null} size={80} defaultAvatar />
              )}
            </Col>
            <Col>
              <h3 className="mb-0 mt-1 mb-1">
                {teacher
                  ? `${teacher.firstName} ${teacher.lastName}`
                  : "Usunięty użytkownik"}
              </h3>

              <p className="text-muted mb-0">
                <FaBook className="me-1" /> {subject || "Brak przedmiotu"}
              </p>
              <p className="text-muted mb-0">
                <FaMapMarkerAlt className="me-1" /> {city || "Brak miasta"}, {state || "Brak województwa"}
              </p>
              <p className="me-1 mb-1">
                <strong>Ocena:</strong> {stars} ({rating ? rating.toFixed(1) : "0.0"}/5)
              </p>
              <p className="me-1 mb-1">
                <strong>Typ zajęć:</strong> {mode || "Nieokreślony"}
              </p>
            </Col>
            <Col xs="auto">
              {teacher && (
                <Link to={`/rezerwacja/${id}`}>
                  <Button variant="success" className="mt-4">
                    Zarezerwuj korepetycje
                  </Button>
                </Link>
              )}
              <p className="fs-5 mb-3 mt-2">
                <FaMoneyBillWave className="me-1" />
                <strong>Cena:</strong> {pricePerHour ? `${pricePerHour} zł` : "Nieokreślona"} / godz.
              </p>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Card.Title as="h2" className="mb-3">
            {title || "Brak tytułu"}
          </Card.Title>
          <Card.Text>{description || "Brak opisu."}</Card.Text>

          <div className="mt-4">
            <h5>
              <FaCalendarAlt className="me-2 " />
              Dostępność
            </h5>
            {availability && availability.length > 0 ? (
              <AvailabilitySchedule availability={availability} />
            ) : (
              <p>Nauczyciel nie udostępnił jeszcze swojej dostępności.</p>
            )}
          </div>

          <div className="border rounded p-3 mb-3 mt-4">
            <h5>
              <FaGraduationCap className="me-2" />
              Wykształcenie
            </h5>
            <Card.Text className="mt-2">
              {education ? (
                <span>{education}</span>
              ) : (
                <span className="text-muted">
                  Nauczyciel nie udostępnił informacji o wykształceniu.
                </span>
              )}
            </Card.Text>
          </div>

          <div className="border rounded p-3 mb-3">
            <h5>
              <FaBriefcase className="me-2" />
              Doświadczenie
            </h5>
            <Card.Text className="mt-2">
              {experience ? (
                <span>{experience}</span>
              ) : (
                <span className="text-muted">
                  Nauczyciel nie udostępnił informacji o doświadczeniu.
                </span>
              )}
            </Card.Text>
          </div>

          <div className="border rounded p-3 mb-3">
            <h5>
              <FaChalkboardTeacher className="me-2" />
              Zakres nauczania
            </h5>
            <Card.Text className="mt-2">
              {teachingScope ? (
                <span>{teachingScope}</span>
              ) : (
                <span className="text-muted">
                  Nauczyciel nie udostępnił informacji o zakresie nauczania.
                </span>
              )}
            </Card.Text>
          </div>

          <hr />
          <div className="mt-4">
            <h5>Opinie:</h5>
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewItem
                  key={review._id}
                  listingId={id}
                  review={review}
                  onUpdate={fetchListing}
                />
              ))
            ) : (
              <p>Brak opinii.</p>
            )}
          </div>
          <hr />
          <div className="mt-4">
            {!isAuthenticated ? (
              <p>
                Aby dodać opinię, <Link to="/login">zaloguj się</Link>.
              </p>
            ) : userReview ? (
              <div>
                {showReviewForm && (
                  <ReviewForm
                    listingId={id}
                    existingReview={userReview}
                    onSuccess={() => {
                      setShowReviewForm(false);
                      fetchListing();
                    }}
                  />
                )}
              </div>
            ) : (
              teacher && (
                <ReviewForm
                  listingId={id}
                  onSuccess={fetchListing}
                  teacherId={teacher._id}
                />
              )
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ListingDetail;

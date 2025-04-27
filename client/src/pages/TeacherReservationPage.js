import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Spinner, Container } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import ReservationCard from "../components/ReservationCard";
import PaginationSection from "../components/PaginationSection";

const TeacherReservationsPage = () => {
  const { user, loading } = useContext(AuthContext);
  const [fetching, setFetching] = useState(true);
  const [announcements, setAnnouncements] = useState([]); // Tablica ogłoszeń
  const [reservations, setReservations] = useState([]); // Tablica rezerwacji
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAnnouncementsAndReservations = async () => {
      setFetching(true);
      const token = localStorage.getItem("token");

      if (token) {
        try {
          // Najpierw trzeba pobrać ogłoszenia zalogowanego użytkownika
          const announcementsResponse = await axios.get(
            `http://localhost:8080/api/users/${user._id}/listings`,
            {
              headers: {
                "x-auth-token": token,
              },
            },
          );

          setAnnouncements(announcementsResponse.data);

          // A potem dla każdego z ogłoszeń trzeba pobrać rezerwacje
          const allReservations = [];
          for (let i = 0; i < announcementsResponse.data.length; i++) {
            const listingId = announcementsResponse.data[i]._id;
            const reservationsResponse = await axios.get(
              `http://localhost:8080/api/reservations/${listingId}`,
              {
                headers: {
                  "x-auth-token": token,
                },
              },
            );
            allReservations.push(...reservationsResponse.data);
          }

          setReservations(allReservations);
        } catch (error) {
          console.error(
            "Błąd podczas pobierania ogłoszeń lub rezerwacji:",
            error,
          );
        } finally {
          setFetching(false);
        }
      }
    };

    fetchAnnouncementsAndReservations();
  }, [user, page]);

  const handleStatusChange = async (reservation, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const lessonCost = parseFloat(reservation.lessonCost);
      const userId = reservation.userId;

      // Aktualizowanie statusu rezerwacji
      await axios.patch(
        `http://localhost:8080/api/reservations/${reservation._id}`,
        {
          status: newStatus,
          userId: userId,
          lessonCost: lessonCost,
        },
        {
          headers: { "x-auth-token": token },
        },
      );

      // Aktualizacja stanu rezerwacji w aplikacji frontendowej
      setReservations((prevReservations) =>
        prevReservations.map((res) =>
          res._id === reservation._id ? { ...res, status: newStatus } : res,
        ),
      );
      setSuccessMessage("Status rezerwacji został zaktualizowany.");
      setErrorMessage("");
    } catch (error) {
      console.error("Błąd podczas zmiany statusu rezerwacji:", error);
      setSuccessMessage("");
      setErrorMessage("Nie udało się zaktualizować statusu.");
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

  const currentPage = (page - 1) * 10;
  const currentReservations = reservations.slice(currentPage, currentPage + 10);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Moje Rezerwacje</h1>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      {/* Wyświetlanie ogłoszeń */}
      {announcements.length > 0 &&
        announcements.map((announcement) => (
          <div key={announcement._id} className="mb-4">
            <div className="row g-3"> 
              {/* Wyświetlanie rezerwacji dla tego ogłoszenia */}
              {reservations.filter(
                (reservation) => reservation.listingId?._id === announcement._id
              ).length === 0 ? (
                ""
              ) : (
                currentReservations
                  .filter(
                    (reservation) =>
                      reservation.listingId?._id === announcement._id
                  )
                  .map((reservation) => (
                    <div key={reservation._id}> 
                      <ReservationCard
                        announcement={announcement}
                        reservation={reservation}
                        handleStatusChange={handleStatusChange}
                      />
                    </div>
                  ))
              )}
            </div>
          </div>
        ))}
      <PaginationSection
        page={page}
        setPage={setPage}
        listings={reservations}
      />
    </div>
  );
};  
export default TeacherReservationsPage;

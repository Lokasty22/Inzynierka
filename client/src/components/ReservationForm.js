import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const ReservationForm = ({ listing, reservations }) => {
  const [errorMessage, setMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    comment: "",
    lessonType: "",
    selectedDate: null,
    selectedTime: "",
    status: "Oczekujące na potwierdzenie",
  });

  const availability = listing?.availability || [];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUser(decodedToken);
  
      setFormData((prevState) => ({
        ...prevState,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        email: decodedToken.email,
        phone: decodedToken.phoneNumber,
        userId: decodedToken._id,
      }));
    }
  
    if (listing.mode) {
    
      if (listing.mode === "Online") {
        setFormData((prevState) => ({
          ...prevState,
          lessonType: "Online",
        }));
      } else if (listing.mode === "Stacjonarnie") {
        setFormData((prevState) => ({
          ...prevState,
          lessonType: "Stacjonarnie",
        }));
      } else if (listing.mode === "Stacjonarnie i Online") {
        setFormData((prevState) => ({
          ...prevState,
          lessonType: "Online", 
        }));
      }
    }
  }, []); 
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedDate: date,
      selectedTime: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lessonCost = listing.pricePerHour;
    if (!formData.selectedDate || !formData.selectedTime) {
      setMessage("Proszę wybrać datę i godzinę.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const lessonCost = parseFloat(listing.pricePerHour).toFixed(2);
      const userBalance = parseFloat(user.balance).toFixed(2);

      if (userBalance >= lessonCost) {
        const updatedBalance = (userBalance - lessonCost).toFixed(2);

        const reservationData = {
          ...formData,
          listingId: listing._id,
          lessonCost: lessonCost,
        
          selectedDate: formData.selectedDate
            ? formData.selectedDate.toISOString()
            : null,
        };

        // Wysyłanie żądania rezerwacji
        await axios.post("/api/reservations", reservationData, {
          headers: { "x-auth-token": token },
        });

        setSuccessMessage("Rezerwacja została pomyślnie wysłana!");
        setMessage("");
        setTimeout(() => navigate(`/ogloszenia/${listing._id}`), 2000);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          comment: "",
          lessonType: "",
          selectedDate: null,
          selectedTime: "",
          status: "Oczekujące na potwierdzenie",
        });
      } else {
        setMessage(
          "Brak wystarczających środków na koncie, aby dokonać rezerwacji.",
        );
      }
    } catch (error) {
      setMessage(
        "Wystąpił błąd przy wysyłaniu rezerwacji. Sprawdź swoje saldo i spróbuj ponownie.",
      );
      console.error(error);
    }
  };

  const daysOfWeek = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];

  const selectedDate = formData.selectedDate;
  const dayOfWeekIndex = selectedDate ? selectedDate.getDay() : null;
  const dayOfWeek = dayOfWeekIndex !== null ? daysOfWeek[dayOfWeekIndex] : "";

  const dayAvailability = availability.find((a) => a.day === dayOfWeek);
  const timesForDay = dayAvailability ? dayAvailability.times : [];

  const reservationsForDate = reservations.filter((reservation) => {
    const reservationDate = new Date(reservation.selectedDate);
    return reservationDate.toDateString() === selectedDate?.toDateString();
  });

  const bookedTimes = reservationsForDate.map((r) => r.selectedTime);

  const availableTimes = timesForDay.filter(
    (time) => !bookedTimes.includes(time),
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="selectedDate">Wybierz datę</label>
        <DatePicker
          selected={formData.selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          placeholderText="Wybierz datę"
          className="form-control"
          id="selectedDate"
          name="selectedDate"
        />
      </div>

      {formData.selectedDate && (
        <div className="form-group">
          <label htmlFor="selectedTime">Wybierz godzinę</label>
          {availableTimes.length > 0 ? (
            <select
              className="form-control"
              id="selectedTime"
              name="selectedTime"
              value={formData.selectedTime}
              onChange={handleChange}
            >
              <option value="">Wybierz godzinę</option>
              {availableTimes.map((time, idx) => (
                <option key={idx} value={time}>
                  {time}
                </option>
              ))}
            </select>
          ) : (
            <p>Brak dostępnych godzin w wybranym dniu.</p>
          )}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="lessonType">Wybierz typ zajęć</label>
        <select
          className="form-control"
          id="lessonType"
          name="lessonType"
          value={formData.lessonType}
          onChange={handleChange}
        >
          {(listing.mode === "Online" || listing.mode === "Stacjonarnie i Online") && (
            <option value="Online">Online</option>
          )}
          
          {(listing.mode === "Stacjonarnie" || listing.mode === "Stacjonarnie i Online") && (
            <option value="Stacjonarnie">Stacjonarnie</option>
          )}
        </select>
      </div>
          

      <div className="form-group mb-3"> {/* Dodano 'mb-3' dla marginesu */}
      <label htmlFor="comment">Komentarz dla korepetytora</label>
        <textarea
          className="form-control"
          id="comment"
          name="comment"
          rows="3"
          value={formData.comment}
          onChange={handleChange}
        ></textarea>
      </div>

        {errorMessage && (
          <div className="alert alert-danger mb-3">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success mb-3">{successMessage}</div>
        )}
        
      <button type="submit" className="btn btn-primary">
        Zarezerwuj
      </button>
    </form>
  );
};

export default ReservationForm;

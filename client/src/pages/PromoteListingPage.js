import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import './PromoteListingPage.css'; 

const PromoteListingPage = () => {
  const { listingId } = useParams(); // Pobiera ID ogłoszenia z URL
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      setError("Wybierz opcję promowania.");
      return;
    }

    const promotionOptions = {
      "3days": { days: 3, price: 9.99 },
      "1week": { days: 7, price: 14.99 },
      "1month": { days: 30, price: 29.99 },
    };

    const selected = promotionOptions[selectedOption];
    console.log('listing id page:', listingId);

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);

    try {
      await axios.post(`http://localhost:8080/api/listings/${listingId}/promote`, {
        days: selected.days,
        price: selected.price,
        userId: decoded._id,
      });
      setSuccessMessage(`Ogłoszenie zostało pomyślnie promowane na ${selected.days} dni!`);
      setTimeout(() => navigate("/"), 2000); // Przekierowanie po 2 sekundach
    } catch (error) {
      setError("Wystąpił błąd podczas promowania ogłoszenia.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body shadow p-3" style={{ borderRadius: "15px" }}>
              <h3 className="card-title text-center">Promuj ogłoszenie</h3>
              <p></p>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Pakiet 3 dni */}
                  <div className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-header text-center">
                        <h5>3 dni</h5>
                        <p className="text-muted">9,99 zł</p>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Zwiększ widoczność swojego ogłoszenia na 3 dni.
                        </p>
                        <div className="form-check">
                          <input
                            className="form-check-input square-checkbox"
                            type="radio"
                            id="promote3days"
                            name="promotionOption"
                            value="3days"
                            checked={selectedOption === "3days"}
                            onChange={handleOptionChange}
                          />
                          <label className="form-check-label" htmlFor="promote3days">
                            Wybierz ten pakiet
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  {/* Pakiet 1 tydzień */}
                  <div className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-header text-center">
                        <h5>1 tydzień</h5>
                        <p className="text-muted">14,99 zł</p>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Zwiększ widoczność swojego ogłoszenia na 7 dni.
                        </p>
                        <div className="form-check">
                          <input
                            className="form-check-input square-checkbox"
                            type="radio"
                            id="promote1week"
                            name="promotionOption"
                            value="1week"
                            checked={selectedOption === "1week"}
                            onChange={handleOptionChange}
                          />
                          <label className="form-check-label" htmlFor="promote1week">
                            Wybierz ten pakiet
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  {/* Pakiet 1 miesiąc */}
                  <div className="col-md-4 mb-3">
                    <div className="card">
                      <div className="card-header text-center">
                        <h5>1 miesiąc</h5>
                        <p className="text-muted">29,99 zł</p>
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          Zwiększ widoczność swojego ogłoszenia na 30 dni.
                        </p>
                        <div className="form-check">
                          <input
                            className="form-check-input square-checkbox"
                            type="radio"
                            id="promote1month"
                            name="promotionOption"
                            value="1month"
                            checked={selectedOption === "1month"}
                            onChange={handleOptionChange}
                          />
                          <label className="form-check-label" htmlFor="promote1month">
                            Wybierz ten pakiet
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {successMessage && (
                  <div className="alert alert-success mt-3">{successMessage}</div>
                )}
  
           
                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Potwierdzam i płacę
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default PromoteListingPage;

import React, { useState } from "react";
import { Modal, Container, Alert } from "react-bootstrap";
import axios from "axios";
import "./NewsletterSection.css";
const NewsletterSection = () => {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [giftcard, setGiftcard] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailSubscribe, setEmailSubscribe] = useState("");
  const isModalOpen = () => setNewsletterOpen(!newsletterOpen);

  const getGiftcard = async () => {
    try {
      const res = await axios.post(`/api/giftcards/wygeneruj-giftcard`);
      setGiftcard(res.data.code);
    } catch (error) {
      console.error("Błąd podczas tworzenia giftcardu");
    }
  };

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setError("");
    if (!emailRegex.test(email)) {
      setError("Wpisz poprawny adres email!");
      return;
    }

    try {
      const res = await axios.post(`/api/newsletter/subscribe`, {
        subscribtionEmail: email,
      });
      setEmailSubscribe(email);
      await getGiftcard();
      setNewsletterOpen(!newsletterOpen);
      setError("");
      setEmail("");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
      console.error("Błąd podczas tworzenia subskrybcji.");
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <div className="newslatter-information">
      <div className="container">
        {error ? <Alert variant="danger">{error}</Alert> : ""}
        <div className="newslatter-section bg-primary text-white p-5 mt-4 rounded shadow">
          <h1>Zapisz się do naszego newslettera</h1>
          <p>Otrzymaj darmowy kod podarunkowy!</p>
          <input
            type="email"
            id="email"
            className="mt-3 rounded"
            value={email}
            onChange={handleChange}
            placeholder="Wpisz adres email"
          ></input>
          <button
            type="submit"
            className="btn btn-outline-light btn-lg "
            onClick={handleSubscribe}
          >
            {" "}
            Zapisz się
          </button>
          {newsletterOpen && (
            <div className="modal fade show d-block" role="dialog">
              <div className="modal-dialog ">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Potwierdzenie</h4>
                    <button
                      type="button"
                      className="d-flex ml-auto btn-close "
                      onClick={isModalOpen}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>Dziękujemy za zapisanie się! Oto twój kod:</p>
                    <p>{giftcard}</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={isModalOpen}
                    >
                      Zamknij
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;

import React, { useState } from "react";
import axios from "axios";
import { Container } from "react-bootstrap";

const ContactForm = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user ? user.email : "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/contact", formData);
      setSuccessMessage("Twoja wiadomość została wysłana.");
      setErrorMessage("");
      setFormData({
        name: user ? `${user.firstName} ${user.lastName}` : "",
        email: user ? user.email : "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
      setErrorMessage("Wystąpił błąd podczas wysyłania wiadomości.");
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <Container className="my-5 shadow p-3" style={{ borderRadius: "15px" }}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Imię i nazwisko
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="subject" className="form-label">
            Temat
          </label>
          <input
            type="text"
            className="form-control"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Treść wiadomości
          </label>
          <textarea
            className="form-control"
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">
          Wyślij wiadomość
        </button>
      </Container>
    </form>
  );
};

export default ContactForm;

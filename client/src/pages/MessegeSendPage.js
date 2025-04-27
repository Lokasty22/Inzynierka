import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const MessageSendPage = () => {
  const { userId } = useParams(); // Pobiera ID odbiorcy z URL
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
    } else if (name === "message") {
      setMessage(value);
    }
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8080/api/conversations/", {
        receiverId: userId,
        //title: title,
        content: message,
      });
      setTitle("");
      setSuccessMessage("Wiadomość wysłana pomyślnie!");
      setMessage("");
      setTimeout(() => navigate("/"), 2000); // Przekierowanie po 2 sek.
    } catch (error) {
      setError("Wystąpił błąd podczas wysyłania wiadomości");
    }
  };

  return (
    <div className="container mt-5 ">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div
              className="card-body shadow p-3"
              style={{ borderRadius: "15px" }}
            >
              <h3 className="card-title text-center">Wyślij wiadomość</h3>
              <form onSubmit={handleSubmit}>
                <label htmlFor="message" className="form-label mt-2">
                  Zapytaj korepetytora o szczegóły:
                </label>
                <div className="mb-3">
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Treść wiadomości"
                    value={message}
                    onChange={handleChange}
                    required
                  />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                <button type="submit" className="btn btn-primary w-100">
                  Wyślij
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSendPage;

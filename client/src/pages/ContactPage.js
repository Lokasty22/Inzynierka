import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import ContactForm from "../components/ContactForm";

const ContactPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:8080/api/me", {
            headers: {
              "x-access-token": token,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Błąd podczas pobierania danych użytkownika:", error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Kontakt</h1>
      <p className="text-center">
        Proszę wypełnić poniższy formularz, aby się skontaktować.
      </p>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ContactForm user={user} />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

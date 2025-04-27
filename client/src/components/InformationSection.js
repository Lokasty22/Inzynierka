import React from "react";
import { Col, Row } from "react-bootstrap";
import "./InformationSection.css";

const InformationSection = () => {
  return (
    <div className="information-banner">
      <div className="container">
        <Row>
          <Col md={6} xs={12}>
            <div className="information-section bg-primary text-white p-5 mt-4 rounded shadow">
              <h2 className="mb-3">Witaj na stronie z korepetycjami!</h2>
              <p className="mb-3">
                Witaj na naszej stronie z ogłoszeniami o korepetycjach! 
                To idealne miejsce dla nauczycieli i uczniów. 
                Niezależnie od tego, czy szukasz korepetycji, czy chcesz oferować swoje usługi, u nas znajdziesz coś dla siebie. 
                Ułatwiamy kontakt z nauczycielami, a dzięki prostemu systemowi rezerwacji lekcji, nauka staje się łatwiejsza i przyjemniejsza.
                 Zarezerwuj swoją pierwszą lekcję już teraz!
              </p>
            </div>
          </Col>
          <Col md={6} xs={12}>
            <div className="about-section bg-primary text-white mt-4 p-3 rounded shadow-lg ml-auto">
              <h2 className="mb-1 text-right">Dlaczego wybrać nasz serwis?</h2>
            </div>
            <div className="custom-list mt-1 p-3 mb-1">
              <ul>
                <li>
                  Tysiące ogłoszeń w wielu kategoriach
                </li>
                <li>
                  Darmowe dodawanie nieograniczonej liczby ogłoszeń
                </li>
                <li>
                  Łatwy system rezerwacji zajęć
                </li>
                <li>
                  Szybki kontakt z koreptytorami
                </li>
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InformationSection;

import React, { useState } from "react";
import "./RedeemGiftcard.css";
import axios from "axios";
import { Alert } from "react-bootstrap";
const RedeemGiftcard = () => {
  const [giftcardCode, setGiftcardCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

    const findGiftcard = async () => {
        try{
            const res = await axios.get(`/api/giftcards/`,{
                params: {code: giftcardCode},
            });
            return res.data;
        } catch(error){
            console.error("Błąd podczas pobierania giftcardu.");
            throw error;
        }
    };

  const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try{
            const giftcard =  await findGiftcard();
            setMessage(`Znaleziono kartę podarunkową, posiada ona: ${giftcard.balance} złotych! ` );
            setGiftcardCode("");
        } catch(error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }else{
                setError("Wystąpił nieoczekiwany błąd.");
            }
            console.error("Błąd podczas znajdywania giftcardu.", error);
        }
  };

  const handleChange = (e) => {
    setGiftcardCode(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleBack = () => {
    window.history.back();
  }
  return (
    <div className="giftcard-information">
      <div className="container">
        {error ? <Alert variant="danger">{error}</Alert> : ''}
        {message ? <Alert variant="success">{message}</Alert> : ''}
        <div className="giftcard-section">
        <div className="arrow left" onClick={handleBack}>
        </div>
          <h2>Wpisz swój kod podarunkowy!</h2>
          <input
            type="text"
            value={giftcardCode}
            onChange={handleChange}
            placeholder="Wpisz swój kod podarunkowy!"
          ></input>
          <button type="submit" onClick={handleSubmit} className="btn btn-outline-light btn-lg">
            Wykorzystaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default RedeemGiftcard;

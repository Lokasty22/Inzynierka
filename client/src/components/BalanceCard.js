import React from "react";
import { Link } from "react-router-dom";
import "./BalanceCard.css";

const BalanceCard = ({ balance }) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="balance-information">
      <div className="container">
        <div className="balance-section position-relative">
          <div className="arrow left" onClick={handleBack}></div>
          <Link
            to="/saldo-konta/historia-wyplat"
            className="btn btn-sm btn-secondary history-btn"
          >
            Historia wypłat
          </Link>
          <div className="balance-container">
            <h2>Saldo konta</h2>
            <div className="balance-box">
              <p>{balance} zł</p>
            </div>
            <div className="d-flex justify-content-end">
              <Link to="/saldo-konta/doladuj">
                <button>Doładuj saldo</button>
              </Link>
              <Link to="/saldo-konta/wyplac">
                <button>Wypłać saldo</button>
              </Link>
              <Link to="/saldo-konta/kody-promocyjne">
                <button>Kod podarunkowy</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;

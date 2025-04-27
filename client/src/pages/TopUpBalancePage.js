import React, { useState } from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";

const TopUpBalancePage = () => {
    const [amount, setAmount] = useState(50); 
    const [customAmount, setCustomAmount] = useState('');
    const [showPayPalButtons, setShowPayPalButtons] = useState(true); 
    const [finalAmount, setFinalAmount] = useState(50); 

    const predefinedAmounts = [10, 20, 50, 100];

    const handleAmountClick = (amt) => {
        setAmount(amt);
        setCustomAmount('');
        setFinalAmount(amt);
        setShowPayPalButtons(true); 
    };

    const handleCustomAmountChange = (e) => {
        setCustomAmount(e.target.value);
        setAmount(null);
        setFinalAmount(null);
        setShowPayPalButtons(false);
    };

    const handleCustomAmountSubmit = () => {
        let amt = parseFloat(customAmount);
        if (!amt || amt <= 0) {
            alert('Proszę wprowadzić poprawną kwotę.');
            return;
        }
        setFinalAmount(amt);
        setShowPayPalButtons(true); 
    };

    return (
        <div className="container my-5" style={{ maxWidth: "600px" }}>
            <h2 className="text-center mb-4">Doładuj saldo</h2>
            
            <p className="mb-2">Wybierz kwotę doładowania:</p>
            <div className="btn-group d-flex mb-4">
                {predefinedAmounts.map((amt) => (
                    <button
                        key={amt}
                        className={`btn btn-${finalAmount === amt ? 'primary' : 'secondary'} flex-fill`}
                        onClick={() => handleAmountClick(amt)}
                    >
                        {amt} PLN
                    </button>
                ))}
            </div>

            <div className="mb-4">
                <label className="form-label">Lub wprowadź własną kwotę:</label>
                <div className="input-group">
                    <input
                        type="number"
                        className="form-control"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        min="1"
                        step="0.01"
                        placeholder="Wpisz kwotę"
                    />
                    <button
                        className="btn btn-primary"
                        style={{ minWidth: "120px" }} // Zmniejszenie szerokości przycisku
                        onClick={handleCustomAmountSubmit}
                    >
                        Zatwierdź
                    </button>
                </div>
            </div>

            {finalAmount ? (
                <p className="text-center">Wybrana kwota: <strong>{finalAmount} PLN</strong></p>
            ) : null}

            <p className="text-center mt-4">Wybierz metodę płatności:</p>
            {showPayPalButtons && finalAmount && (
                <div className="mt-3">
                    <PayPalButtons
                        key={finalAmount} 
                        style={{ layout: 'vertical' }}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        value: finalAmount.toFixed(2),
                                    },
                                }],
                            });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then(details => {
                                alert(`Płatność na kwotę ${finalAmount} PLN zakończona sukcesem!`);
                            });
                        }}
                        onError={(err) => {
                            console.error('Błąd PayPal:', err);
                            alert('Wystąpił błąd podczas płatności PayPal.');
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default TopUpBalancePage;

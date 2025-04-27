import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/payments/history', {
          headers: { 'x-auth-token': token },
        });
        setPayments(response.data);
      } catch (error) {
        console.error('Błąd podczas pobierania historii wypłat:', error);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container my-5">
      <h2>Historia wypłat</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Data</th>
            <th>Kwota</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment._id}>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                <td>{payment.amount} zł</td>
                <td>{payment.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                Brak danych do wyświetlenia
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PaymentHistoryPage;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Table, Button, Modal } from 'react-bootstrap';

const AdminPayments = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userRole === 'Admin') {
      fetchPayments();
    }
  }, [isAuthenticated, userRole]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/payments', {
        headers: { 'x-auth-token': token },
      });
      setPayments(res.data);
    } catch (error) {
      console.error('Błąd podczas pobierania płatności:', error);
    }
  };

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/payments/${selectedPayment._id}`,
        { status: 'Zatwierdzony' },
        {
          headers: { 'x-auth-token': token },
        }
      );
      setShowModal(false);
      fetchPayments();
    } catch (error) {
      console.error('Błąd podczas zatwierdzania płatności:', error);
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/admin/payments/${selectedPayment._id}`,
        { status: 'Odrzucony' },
        {
          headers: { 'x-auth-token': token },
        }
      );
      setShowModal(false);
      fetchPayments();
    } catch (error) {
      console.error('Błąd podczas odrzucania płatności:', error);
    }
  };

  if (!isAuthenticated || userRole !== 'Admin') {
    return <p>Brak dostępu.</p>;
  }

  return (
    <div className="container my-5">
      <h2>Prośby o wypłatę</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Data</th>
            <th>Użytkownik</th>
            <th>Email</th>
            <th>Kwota</th>
            <th>Status</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td>{new Date(payment.createdAt).toLocaleString()}</td>
              <td>
                {payment.user
                  ? `${payment.user.firstName} ${payment.user.lastName}`
                  : 'Nieznany użytkownik'}
              </td>
              <td>{payment.email || 'Nieznany email'}</td>
              <td>{payment.amount} zł</td>
              <td>{payment.status}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleView(payment)}
                >
                  Zobacz
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedPayment && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Szczegóły prośby o wypłatę</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Użytkownik:</strong>{' '}
              {selectedPayment.user
                ? `${selectedPayment.user.firstName} ${selectedPayment.user.lastName}`
                : 'Nieznany użytkownik'}
            </p>
            <p>
              <strong>Email:</strong> {selectedPayment.email || 'Nieznany email'}
            </p>
            <p>
              <strong>Kwota:</strong> {selectedPayment.amount} zł
            </p>
            <p>
              <strong>Status:</strong> {selectedPayment.status}
            </p>
            <p>
              <strong>Data:</strong>{' '}
              {new Date(selectedPayment.createdAt).toLocaleString()}
            </p>
          </Modal.Body>
          <Modal.Footer>
            {selectedPayment.status === 'W toku' && (
              <>
                <Button variant="success" onClick={handleApprove}>
                  Zatwierdź
                </Button>
                <Button variant="danger" onClick={handleReject}>
                  Odrzuć
                </Button>
              </>
            )}
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Zamknij
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminPayments;

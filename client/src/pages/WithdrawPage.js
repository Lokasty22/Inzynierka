import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  Spinner,
} from 'react-bootstrap';
import { FaMoneyCheckAlt, FaEnvelope, FaWallet } from 'react-icons/fa';

const WithdrawPage = () => {
  const { user } = useContext(AuthContext); 
  const [email] = useState(user?.email || ''); 
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [messageVariant, setMessageVariant] = useState('');
  const [balance] = useState(user?.balance || 0); 
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Walidacja kwoty
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setMessage('Kwota musi być liczbą większą niż 0.');
      setMessageVariant('danger');
      return;
    }

    if (Number(amount) > balance) {
      setMessage('Nie możesz wypłacić więcej niż masz na saldzie.');
      setMessageVariant('danger');
      return;
    }

    try {
      setIsLoading(true); 
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/payments',
        { email, amount: Number(amount) },
        {
          headers: { 'x-auth-token': token },
        }
      );
      setMessage('Twoja prośba o wypłatę została wysłana do administratora.');
      setMessageVariant('success');
      setAmount('');
    } catch (error) {
      console.error('Błąd podczas wysyłania prośby o wypłatę:', error);
      const errorMsg =
        error.response?.data?.message ||
        'Wystąpił błąd podczas wysyłania prośby.';
      setMessage(errorMsg);
      setMessageVariant('danger');
    } finally {
      setIsLoading(false); 
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <FaMoneyCheckAlt className="me-2" />
                Wypłać środki
              </Card.Title>
              {message && (
                <Alert
                  variant={messageVariant}
                  onClose={() => setMessage('')}
                  dismissible
                >
                  {message}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>
                    <FaEnvelope className="me-2" />
                    Email:
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    readOnly
                    plaintext
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label>
                    <FaWallet className="me-2" />
                    Kwota do wypłaty:
                  </Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Wprowadź kwotę"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    max={balance}
                    required
                  />
                  <Form.Text className="text-muted">
                    Dostępne saldo: {balance} PLN
                  </Form.Text>
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Przetwarzanie...
                    </>
                  ) : (
                    'Wyślij prośbę o wypłatę'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WithdrawPage;

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Table, Button, Modal } from 'react-bootstrap';

const AdminMessages = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && userRole === 'Admin') {
      fetchMessages();
    }
  }, [isAuthenticated, userRole]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/admin/messages', {
        headers: { 'x-auth-token': token },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Błąd podczas pobierania wiadomości:', error);
    }
  };

  const handleView = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Czy na pewno chcesz usunąć tę wiadomość?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/admin/messages/${id}`, {
          headers: { 'x-auth-token': token },
        });
        setMessages(messages.filter((message) => message._id !== id));
      } catch (error) {
        console.error('Błąd podczas usuwania wiadomości:', error);
      }
    }
  };

  if (!isAuthenticated || userRole !== 'Admin') {
    return <p>Brak dostępu.</p>;
  }

  return (
    <div className="container my-5">
      <h2>Wiadomości kontaktowe</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Data</th>
            <th>Od</th>
            <th>Temat</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message) => (
            <tr key={message._id}>
              <td>{new Date(message.createdAt).toLocaleString()}</td>
              <td>{message.name} ({message.email})</td>
              <td>{message.subject}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleView(message)}>
                  Zobacz
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(message._id)}>
                  Usuń
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedMessage && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Szczegóły wiadomości</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Od:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
            <p><strong>Temat:</strong> {selectedMessage.subject}</p>
            <p><strong>Data:</strong> {new Date(selectedMessage.createdAt).toLocaleString()}</p>
            <hr />
            <p>{selectedMessage.message}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Zamknij
            </Button>
            <Button variant="danger" onClick={() => handleDelete(selectedMessage._id)}>
              Usuń wiadomość
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminMessages;

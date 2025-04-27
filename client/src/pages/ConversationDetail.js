import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Alert, Form, Button } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import './ConversationDetail.css'; 

const ConversationDetail = () => {
    const { id } = useParams();
    const [conversation, setConversation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [receiverId, setReceiverId] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const fetchConversation = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    setCurrentUserId(decoded._id);

                    const response = await axios.get(`/api/conversations/${id}`, {
                        headers: { 'x-auth-token': token },
                    });
                    const conversationData = response.data;

                    const recipient = conversationData.participants.find(
                        (participant) => participant._id !== decoded._id
                    );
                    setReceiverId(recipient._id);
                    setConversation(conversationData);
                }
            } catch (err) {
                setError('Nie udało się pobrać szczegółów konwersacji.');
            } finally {
                setLoading(false);
            }
        };

        fetchConversation();
    }, [id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !receiverId) return;

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const response = await axios.post(
                'http://localhost:8080/api/conversations/',
                {
                    receiverId: receiverId,
                    content: newMessage,
                },
                { headers: { 'x-auth-token': token } }
            );

            const messageWithSender = {
                ...response.data,
                sender: {
                    _id: currentUserId,
                    firstName: decoded.firstName,
                    lastName: decoded.lastName,
                },
            };

            setConversation((prev) => ({
                ...prev,
                messages: [...prev.messages, messageWithSender],
            }));
            setNewMessage('');
        } catch (err) {
            alert('Nie udało się wysłać wiadomości.');
        } finally {
            setSending(false);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-5 ">
             <div className="row justify-content-center">
        <div className="conversation-container">
            <div className="messages-container">
                {conversation.messages.map((message) => (
                    <div
                        key={message._id}
                        className={`message ${
                            message.sender._id === currentUserId
                                ? 'message-right'
                                : 'message-left'
                        }`}
                    >
                        <div className="message-content">{message.content}</div>
                        <div className="message-meta">
                            {message.sender.firstName} -{' '}
                            {new Date(message.date).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            <Form onSubmit={handleSendMessage} className="message-form">
                <Form.Group controlId="newMessage">
                    <Form.Control
                        type="text"
                        placeholder="Wpisz wiadomość..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={sending}
                    />
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={sending || !newMessage.trim()}
                    className="mt-2"
                >
                    {sending ? 'Wysyłanie...' : 'Wyślij'}
                </Button>
            </Form>
        </div>
        </div>
        </div>
    );
};

export default ConversationDetail;

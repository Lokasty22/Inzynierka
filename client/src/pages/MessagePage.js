import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ConversationsPage = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [message, setMessage] = useState(''); 
    const navigate = useNavigate(); // Użycie useNavigate

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    setCurrentUserId(decoded._id); 
                }
                const res = await axios.get('/api/conversations', {
                    headers: { 'x-auth-token': token }
                });
                setConversations(res.data);
            } catch (err) {
                setError('Nie udało się pobrać listy konwersacji.');
            } finally {
                setLoading(false);
            }
        };

        fetchConversations();
    }, []); 
    
    const handleDeleteConversation = async (conversationId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/conversations/${conversationId}`, {
                headers: { 'x-auth-token': token }
            });
            setConversations(conversations.filter(conv => conv._id !== conversationId));
            alert('Konwersacja została usunięta z Twojego widoku');
        } catch (err) {
            setError('Nie udało się usunąć konwersacji.');
        }
    };

    const handleViewConversation = (conversationId) => {
        navigate(`/conversations/${conversationId}`); // Przekierowanie na stronę szczegółów konwersacji
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
            <h2>Moje Konwersacje</h2>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Użytkownik</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {conversations.map((conv) => (
                        <tr key={conv._id}>
                            <td>
                                {conv.participants
                                    .filter((p) => p._id !== currentUserId) 
                                    .map((p) => `${p.firstName} ${p.lastName} (${p.email})`)
                                    .join(', ')}
                            </td>
                            <td>
                                <Button
                                    variant="primary"
                                    onClick={() => handleViewConversation(conv._id)} // Obsługa kliknięcia
                                >
                                    Wyświetl
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleDeleteConversation(conv._id)}
                                    className="ms-2"
                                >
                                    Usuń z widoku
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {message && <p>{message}</p>}
        </div>
        </div>
    );
};

export default ConversationsPage;

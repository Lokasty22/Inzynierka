import React from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfilePicture from '../components/ProfilePicture';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { FaUser, FaGlobe } from 'react-icons/fa';
import './ProfilePage.css';
const ProfilePage = () => {
    const {id: userId} = useParams();
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [profile, setProfile] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const fetchUserData = async () => {
        setFetching(true);
        setError('');
        try {
            const res = await axios.get(`/api/users/${userId}`);
            setUserRole(res.data.role);
            setProfile(res.data);
        } catch (error)
        {
            setError('Błąd podczas pobierania danych użytkownika.');
            console.error(error);
        }
        finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);
    

    if(fetching) {
        return (
            <Container className="my-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if(error){
        return (
            <Container className="my-5 text-center">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }


    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow p-3" style={{ borderRadius: '15px' }}>
                        <Card.Body>
                            <div className="text-center mb-4">
                                <ProfilePicture user={profile} />
                            </div>
                            <h2 className="text-center mb-4">Profil użytkownika</h2>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <FaUser className="me-2" />
                                    <strong>Imię:</strong> {profile.firstName}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <FaUser className="me-2" />
                                    <strong>Nazwisko:</strong> {profile.lastName}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <FaGlobe className="me-2" />
                                    <strong>Rola:</strong> { userRole ? userRole : 'Brak informacji'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <FaGlobe className="me-2" />
                                    <strong>Kraj:</strong> {profile.country ? profile.country : 'Brak informacji'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <FaMapMarkerAlt className="me-2" />
                                    <strong>Województwo:</strong> {profile.state ? profile.state : 'Brak informacji'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <FaMapMarkerAlt className="me-2" />
                                    <strong>Miasto:</strong> {profile.city ? profile.city : 'Brak informacji'}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <FaInfoCircle className="me-2" />
                                    <strong>O mnie:</strong> {profile.about ? profile.about : 'Brak informacji'}
                                </ListGroup.Item>
                            </ListGroup>
                            <div className="text-center mt-4">
                                <Link to={`/wiadomosc/${userId}`}>
                                <Button variant="success" size="lg">Skontaktuj się</Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


export default ProfilePage;
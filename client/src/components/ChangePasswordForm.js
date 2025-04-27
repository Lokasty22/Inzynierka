import React from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';

const ChangePasswordForm = ({
                                currentPassword,
                                newPassword,
                                confirmNewPassword,
                                handleCurrentPasswordChange,
                                handleNewPasswordChange,
                                handleConfirmNewPasswordChange,
                                handleSubmitPassword,
                                passwordSuccess,
                                passwordError,
                            }) => {
    return (
        <Card className="mb-4 shadow-lg">
            <Card.Body>
                <Card.Header>
                    <h5 className="mb-2">Zmień hasło</h5>
                </Card.Header>
                {passwordSuccess && <Alert variant="success">{passwordSuccess}</Alert>}
                {passwordError && <Alert variant="danger">{passwordError}</Alert>}
                <Form onSubmit={handleSubmitPassword}>
                    <Form.Group controlId="currentPassword" className="mb-3 mt-3">
                        <Form.Label>Obecne hasło</Form.Label>
                        <Form.Control
                            type="password"
                            value={currentPassword}
                            onChange={handleCurrentPasswordChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="newPassword" className="mb-3">
                        <Form.Label>Nowe hasło</Form.Label>
                        <Form.Control
                            type="password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmNewPassword" className="mb-3">
                        <Form.Label>Potwierdź nowe hasło</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmNewPassword}
                            onChange={handleConfirmNewPasswordChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Zmień hasło
                    </Button>

                </Form>
            </Card.Body>
        </Card>
    );
};

export default ChangePasswordForm;

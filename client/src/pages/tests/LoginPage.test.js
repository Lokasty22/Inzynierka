import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import axios from 'axios';

jest.mock('axios');

describe('LoginPage', () => {
    test('renderuje formularz logowania', () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>
            </AuthProvider>
        );

        expect(screen.getByText('Logowanie')).toBeInTheDocument();
    });

    test('pokazuje błąd dla niepoprawnych danych logowania', async () => {
        axios.post.mockRejectedValueOnce({
            response: {
                status: 401,
                data: { message: 'Niepoprawny email lub hasło!' },
            },
        });

        render(
            <AuthProvider>
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>
            </AuthProvider>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Hasło'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByText('Zaloguj się'));

        expect(await screen.findByText('Niepoprawny email lub hasło!')).toBeInTheDocument();
    });
});
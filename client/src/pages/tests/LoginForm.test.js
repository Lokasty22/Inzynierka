import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LoginPage from '../LoginPage';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');
jest.mock('jwt-decode', () => jest.fn());

import jwt_decode from 'jwt-decode';

describe('LoginPage', () => {
    test('pomyślnie loguje użytkownika', async () => {
        const login = jest.fn();
        const token = 'fake-jwt-token';
        const role = 'Uczeń';

        jwt_decode.mockReturnValue({ role });

        axios.post.mockResolvedValueOnce({
            data: {
                data: token,
                message: 'logowanie udane',
            },
        });

        const contextValue = {
            isAuthenticated: false,
            userRole: null,
            login,
            logout: jest.fn(),
        };

        render(
            <AuthContext.Provider value={contextValue}>
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('Email'), {
                target: { value: 'user@example.com' },
            });
            fireEvent.change(screen.getByPlaceholderText('Hasło'), {
                target: { value: 'password123' },
            });
            fireEvent.click(screen.getByText('Zaloguj się'));
        });


    });
});

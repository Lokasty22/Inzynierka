import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RegisterPage from '../RegisterPage';
import { AuthProvider } from '../../context/AuthContext';
import axios from 'axios';

jest.mock('axios');

test('pomyślna rejestracja użytkownika', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Użytkownik utworzony poprawnie' } });

    render(
        <AuthProvider>
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        </AuthProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Imię'), { target: { value: 'Test' } });
    fireEvent.change(screen.getByPlaceholderText('Nazwisko'), { target: { value: 'Testowy' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Numer telefonu'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Hasło'), { target: { value: 'password123' } });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Uczeń' } });

    fireEvent.click(screen.getByText('Zarejestruj się'));

    expect(await screen.findByText('Rejestracja zakończona sukcesem')).toBeInTheDocument();
});
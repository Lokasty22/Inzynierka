import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Navbar', () => {
    test('wyświetla linki dla niezalogowanego użytkownika', () => {
        render(
            <AuthContext.Provider value={{ isAuthenticated: false }}>
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText('Logowanie')).toBeInTheDocument();
        expect(screen.getByText('Rejestracja')).toBeInTheDocument();
    });

    test('wyświetla menu dla zalogowanego użytkownika', () => {
        render(
            <AuthContext.Provider value={{ isAuthenticated: true }}>
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        expect(screen.getByText('Mój profil')).toBeInTheDocument();
        expect(screen.queryByText('Logowanie')).toBeNull();
        expect(screen.queryByText('Rejestracja')).toBeNull();
    });

    test('wywołuje funkcję logout po kliknięciu "Wyloguj"', () => {
        const logout = jest.fn();

        render(
            <AuthContext.Provider value={{ isAuthenticated: true, logout }}>
                <BrowserRouter>
                    <Navbar />
                </BrowserRouter>
            </AuthContext.Provider>
        );

        fireEvent.click(screen.getByText('Mój profil'));

        fireEvent.click(screen.getByText('Wyloguj'));

        expect(logout).toHaveBeenCalled();
    });
});
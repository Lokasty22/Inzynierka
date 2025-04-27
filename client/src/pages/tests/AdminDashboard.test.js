import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 
import AdminDashboard from '../AdminDashboard'; 

const renderWithProviders = (ui, { isAuthenticated, userRole }) => {
  return render(
    <AuthContext.Provider value={{ isAuthenticated, userRole }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('AdminDashboard', () => {
  test('wyświetla komunikat o braku dostępu, jeśli użytkownik nie jest zalogowany', () => {
    renderWithProviders(<AdminDashboard />, { isAuthenticated: false, userRole: 'Admin' });
    expect(screen.getByText(/Brak dostępu./i)).toBeInTheDocument();
  });

  test('wyświetla komunikat o braku dostępu, jeśli użytkownik nie jest administratorem', () => {
    renderWithProviders(<AdminDashboard />, { isAuthenticated: true, userRole: 'User' });
    expect(screen.getByText(/Brak dostępu./i)).toBeInTheDocument();
  });

  test('wyświetla panel administratora, jeśli użytkownik jest zalogowany jako administrator', () => {
    renderWithProviders(<AdminDashboard />, { isAuthenticated: true, userRole: 'Admin' });

    expect(screen.getByText(/Panel Administratora/i)).toBeInTheDocument();

    expect(screen.getByText(/Zarządzaj użytkownikami/i)).toBeInTheDocument();
    expect(screen.getByText(/Zarządzaj ogłoszeniami/i)).toBeInTheDocument();
    expect(screen.getByText(/Przeglądaj wiadomości/i)).toBeInTheDocument();
    expect(screen.getByText(/Zarządzanie opiniami/i)).toBeInTheDocument();
    expect(screen.getByText(/Statystyki/i)).toBeInTheDocument();
    expect(screen.getByText(/Zarządzaj artykułami/i)).toBeInTheDocument();
  });

  test('sprawdza poprawność linków w panelu administratora', () => {
    renderWithProviders(<AdminDashboard />, { isAuthenticated: true, userRole: 'Admin' });

    expect(screen.getByRole('link', { name: /Zarządzaj użytkownikami/i })).toHaveAttribute('href', '/admin/users');
    expect(screen.getByRole('link', { name: /Zarządzaj ogłoszeniami/i })).toHaveAttribute('href', '/admin/listings');
    expect(screen.getByRole('link', { name: /Przeglądaj wiadomości/i })).toHaveAttribute('href', '/admin/messages');
    expect(screen.getByRole('link', { name: /Zarządzanie opiniami/i })).toHaveAttribute('href', '/admin/opinions');
    expect(screen.getByRole('link', { name: /Statystyki/i })).toHaveAttribute('href', '/admin/statistics');
    expect(screen.getByRole('link', { name: /Zarządzaj artykułami/i })).toHaveAttribute('href', '/admin/articles');
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MyProfilePage from '../MyProfilePage';
import {AuthProvider} from '../../context/AuthContext';
import axios from 'axios';

jest.mock('axios');

beforeEach(() => {
    axios.get.mockResolvedValue({
        data: {
            firstName: 'Jan',
            lastName: 'Kowalski',
            gender: 'Męźczyzna',
            birthDate: '1990-01-01',
            phoneNumber: '123456789',
            email: 'jan.kowalski@example.com',
            country: 'Polska',
            state: 'Mazowieckie',
            city: 'Warszawa',
            profilePicture: '',
            bio: '',
        },
    });
});

afterEach(() => {
    localStorage.clear();
});


test('pomyślnie zmienia hasło', async () => {
    const token = 'fake-jwt-token';

    axios.put.mockResolvedValueOnce({ data: { message: 'Hasło zostało zmienione.' } });

    localStorage.setItem('token', token);

    render(
        <AuthProvider>
            <MyProfilePage />
        </AuthProvider>
    );

    const oldPasswordInput = screen.getByLabelText('Obecne hasło');
    const newPasswordInput = screen.getByLabelText('Nowe hasło');
    const confirmNewPasswordInput = screen.getByLabelText('Potwierdź nowe hasło');

    fireEvent.change(oldPasswordInput, { target: { value: 'oldpassword123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmNewPasswordInput, { target: { value: 'newpassword123' } });

    fireEvent.click(screen.getByRole('button', { name: /Zmień hasło/i }));

    const successAlert = await screen.findByRole('alert');
    expect(successAlert).toHaveTextContent('Hasło zostało zmienione.');
});

test('pomyślnie zmienia dane użytkownika', async () => {
    const token = 'fake-jwt-token';

    axios.put.mockResolvedValueOnce({ data: { message: 'Profil został zaktualizowany.' } });

    localStorage.setItem('token', token);
    render(
        <AuthProvider>
            <MyProfilePage />
        </AuthProvider>
    );

    const editButton = screen.getByRole('button', { name: /Edytuj/i });
    const genderInput = screen.getByLabelText('Płeć');
    const phoneNumberInput = screen.getByLabelText('Telefon');
    const countryInput = screen.getByLabelText('Kraj');
    const stateInput = screen.getByLabelText('Województwo');
    const cityInput = screen.getByLabelText('Miejscowość');
    const bioInput = screen.getByLabelText('O mnie');

    fireEvent.click(editButton);
    fireEvent.change(genderInput, {
        target: { value: 'Kobieta' } } );
    fireEvent.change(phoneNumberInput, { target: { value: '987654321' } });
    fireEvent.change(countryInput, { target: { value: 'Niemcy' } });
    fireEvent.change(stateInput, { target: { value: 'Berlin' } });
    fireEvent.change(cityInput, { target: { value: 'Berlin' } });
    fireEvent.change(bioInput, { target: { value: 'Jestem programistką.' } });

    fireEvent.click(screen.getByRole('button', { name: /Zapisz zmiany/i }));

    const successAlert = await screen.findByRole('alert');
    expect(successAlert).toHaveTextContent('Profil został zaktualizowany.');
});

test('niepomyślnie zmienia hasło', async () => {
    const token = 'fake-jwt-token';

    axios.put.mockRejectedValueOnce({
        response: {
            data: { message: 'Niepoprawne hasło.' },
        },
    });

    localStorage.setItem('token', token);

    render(
        <AuthProvider>
            <MyProfilePage />
        </AuthProvider>
    );

    const oldPasswordInput = screen.getByLabelText('Obecne hasło');
    const newPasswordInput = screen.getByLabelText('Nowe hasło');
    const confirmNewPasswordInput = screen.getByLabelText('Potwierdź nowe hasło');

    fireEvent.change(oldPasswordInput, { target: { value: 'oldpassword123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
    fireEvent.change(confirmNewPasswordInput, { target: { value: 'newpassword133' }});


    fireEvent.click(screen.getByRole('button', { name: /Zmień hasło/i }));

    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Nowe hasła nie są takie same.');

});
/*
test('niepomyślnie zmienia dane użytkownika', async () => {
    const token = 'fake-jwt-token';

    axios.put.mockRejectedValueOnce({
        response: {
            data: { message: 'Niepoprawne dane.' },
        },
    });

    localStorage.setItem('token', token);

    render(
        <AuthProvider>
            <MyProfilePage />
        </AuthProvider>
    );

    const editButton = screen.getByRole('button', { name: /Edytuj/i });

    fireEvent.click(editButton);

    fireEvent.change(genderInput, {
        target: { value: 'Kobieta' } } );
    fireEvent.change(phoneNumberInput, { target: { value: '98765432111' } });
    fireEvent.change(countryInput, { target: { value: 'Niemcy4' } });
    fireEvent.change(stateInput, { target: { value: 'Berlin4' } });
    fireEvent.change(cityInput, { target: { value: 'Berlin4' } });
    fireEvent.change(bioInput, { target: { value: 'Jestem programistką.' } });

    fireEvent.click(screen.getByRole('button', { name: /Zapisz zmiany/i }));

    const errorAlert = await screen.findByRole('alert');
    expect(errorAlert).toHaveTextContent('Niepoprawne dane.');

});

 */
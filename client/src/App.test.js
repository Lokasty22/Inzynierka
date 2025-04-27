import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renderuje cos', () => {
    render(<App />);
    const linkElement = screen.getByText(/Znajdź najlepsze/i);
    expect(linkElement).toBeInTheDocument();
});

import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
            <div className="text-center">
                <i className="fas fa-exclamation-triangle fa-4x text-danger mb-4"></i>
                <h1 className="display-4">NIE POSIADASZ DOSTĘPU</h1>
                <p className="lead">Nie masz uprawnień do oglądania żądanej strony.</p>
                <Link to="/" className="btn btn-primary mt-3">
                    Strona Główna
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
